import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { selectRuleset, addNewRuleset } from '../redux/rulesSlice';
import { Ruleset } from '../redux/rulesSlice';
import { toast } from 'react-toastify';

const RulesetDropdown: React.FC = () => {
  const dispatch = useDispatch();

  const rulesets = useSelector((state: RootState) => state.rules.rulesets);
  const selectedRuleset = useSelector((state: RootState) => state.rules.selectedRuleset);

  //for adding new ruleset, action creator
  const addNewRulesetAction = () => {
    const ruleSet: Ruleset = {
      id: rulesets.length + 1,
      name: 'New Ruleset',
      rules: [],
    };

    dispatch(addNewRuleset(ruleSet));
    toast.success('New Ruleset Added Successfully');
  };

  // Watch for rulesets update and select the new ruleset
  useEffect(() => {
    if (rulesets.length > 0) {
      const lastAddedRuleset = rulesets[rulesets.length - 1];
      dispatch(selectRuleset(lastAddedRuleset));
    }
  }, [rulesets]);

  //on change event for ruleset dropdown
  const onChangeRuleSet = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'new') {
      addNewRulesetAction();
    }
    //load the selected ruleset on base id
    const selectedRuleset = rulesets.find((r) => r.id === Number(e.target.value));

    dispatch(
      selectRuleset({
        ...selectedRuleset,
        rules: selectedRuleset?.rules ?? [],
        id: selectedRuleset?.id ?? 0,
        name: selectedRuleset?.name ?? '',
      })
    );
  };

  return (
    <select
      className="border p-2 w-full my-2"
      onChange={(e) => onChangeRuleSet(e)}
      value={selectedRuleset?.id ?? ''}
    >
      {rulesets.map((r) => (
        <option key={r.id} value={r.id}>
          {r.name}
        </option>
      ))}
      <option value="new">+ Add New Ruleset</option>
    </select>
  );
};
export default RulesetDropdown;
