import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { mockData } from "../utils";

export interface Rule {
  id: number;
  unitName: string;
  findingName: string;
  comparator: string;
  measurement: string;
  comparedValue: number | string;
  action: string;
}

export interface Ruleset {
  id: number;
  name: string;
  rules: Rule[];
}

interface RulesState {
  rulesets: Ruleset[];
  selectedRuleset: Ruleset | null;
  selectedRule: Rule | null;
  isEditing: boolean;
  isAddingRule: boolean;
  isAddingRuleSet: boolean;
}

const initialState: RulesState = {
  rulesets: mockData?.rule_sets,
  selectedRuleset: mockData?.rule_sets[0],
  isEditing: false,
  selectedRule: null,
  isAddingRule: false,
  isAddingRuleSet: false,
};

const rulesSlice = createSlice({
  name: "rules",
  initialState,
  reducers: {
    addNewRuleset: (state, action: PayloadAction<Ruleset>) => {
      state.rulesets.push(action.payload);
    },
    editRuleset: (state, action: PayloadAction<Ruleset>) => {
      state.selectedRuleset = action.payload;
    },
    setRulesets: (state, action: PayloadAction<Ruleset[]>) => {
      state.rulesets = action.payload;
    },
    selectRuleset: (state, action: PayloadAction<Ruleset>) => {
      state.selectedRuleset = action.payload;
    },
    toggleEditMode: (state) => {
      state.isEditing = !state.isEditing;
    },
    toggleAddRule: (state) => {
      state.isAddingRule = !state.isAddingRule;
    },
    addRule: (state, action: PayloadAction<Rule>) => {
      state.selectedRuleset?.rules.push(action.payload);
      state.selectedRule = action.payload;
    },
    selectRule: (state, action: PayloadAction<Rule | null>) => {
      state.selectedRule = action.payload;
    },
    editRule: (state, action: PayloadAction<Rule>) => {
      if (state.selectedRule) {
        state.selectedRule = action.payload;
      }
    },
    updateRule: (state, action: PayloadAction<Rule>) => {
      if (state.selectedRuleset) {
        const index = state.selectedRuleset.rules.findIndex(
          (rule) => rule.id === action.payload.id
        );
        if (index !== -1) state.selectedRuleset.rules[index] = action.payload;
      }
    },
    deleteRule: (state, action: PayloadAction<number>) => {
      if (state.selectedRuleset) {
        state.selectedRuleset.rules = state.selectedRuleset.rules.filter(
          (rule) => rule.id !== action.payload
        );
      }
    },
    saveRuleset: (state) => {
      const index = state.rulesets.findIndex(
        (ruleset) => ruleset.id === state.selectedRuleset?.id
      );
      if (index !== -1 && state.selectedRuleset) {
        state.rulesets[index] = state.selectedRuleset;
      }
    },
    cancelRuleset: (state) => {
      // Reset the selected ruleset to the original state
      const index = state.rulesets.findIndex(
        (ruleset) => ruleset.id === state.selectedRuleset?.id
      );
      console.log("state.rulesets[index];", state.rulesets[index]);
      if (index !== -1) {
        state.selectedRuleset = state.rulesets[index];
      }
    },

    copyRuleset: (state) => {
      if (state.selectedRuleset) {
        const copiedRuleset: Ruleset = {
          ...state.selectedRuleset,
          id: state.rulesets.length + 1,
          name: `${state.selectedRuleset.name}_(1)`,
          rules: state.selectedRuleset.rules.map((rule) => ({
            ...rule,
            id: Date.now() + Math.random(),
          })),
        };
        state.rulesets.push(copiedRuleset);
      }
    },
    deleteRuleset: (state, action: PayloadAction<number>) => {
      state.rulesets = state.rulesets.filter(
        (ruleset) => ruleset.id !== action.payload
      );
    },
    reorderRules: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      if (state.selectedRuleset) {
        const [movedRule] = state.selectedRuleset.rules.splice(
          action.payload.dragIndex,
          1
        );
        state.selectedRuleset.rules.splice(
          action.payload.hoverIndex,
          0,
          movedRule
        );
      }
    },
  },
});

export const {
  addNewRuleset,
  editRuleset,
  setRulesets,
  selectRuleset,
  toggleEditMode,
  addRule,
  editRule,
  deleteRule,
  copyRuleset,
  reorderRules,
  toggleAddRule,
  saveRuleset,
  cancelRuleset,
  selectRule,
  updateRule,
  deleteRuleset,
} = rulesSlice.actions;
export default rulesSlice.reducer;
