import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import {
  toggleEditMode,
  addRule,
  editRuleset,
  saveRuleset,
  cancelRuleset,
  selectRule,
  copyRuleset,
  deleteRuleset,
} from '../redux/rulesSlice';
import RulesTable from '../components/RulesTable';
import RulesetDropdown from '../components/RulesetDropdown';
import ConfirmModal from '../components/ConfirmationModal';
import ErrorBoundary from '../components/ErrorBoundary';
import { ToastContainer, toast } from 'react-toastify';
import withLogging from '../hoc/withLogging';

const EnhancedRulesTable = withLogging(RulesTable);

const RulesPage: React.FC = () => {
  const [cancelModalOpen, setCancelModalOpen] = React.useState(false);
  const [deleteRuleSetModal, setDeleteRuleSetModalOpen] = React.useState(false);
  const dispatch = useDispatch();
  const selectedRuleSet = useSelector((state: RootState) => state.rules.selectedRuleset);

  const rulesets = useSelector((state: RootState) => state.rules.rulesets);
  const isEditing = useSelector((state: RootState) => state.rules.isEditing);

  const confirmCancel = () => {
    dispatch(toggleEditMode());
    dispatch(cancelRuleset());
    dispatch(selectRule(null));
    setCancelModalOpen(!cancelModalOpen);
  };
  const openCancelModal = () => {
    setCancelModalOpen(true);
  };

  // delete ruleset method, action call in which selected ruleset is deleted
  const confirmDelete = () => {
    dispatch(deleteRuleset(selectedRuleSet?.id ?? 0));
    dispatch(toggleEditMode());
    dispatch(selectRule(null));
    setDeleteRuleSetModalOpen(false);
    toast.info('Ruleset Deleted Successfully');
  };

  // delete ruleset method, action call in which selected ruleset is deleted
  const openDeleteModal = () => {
    setDeleteRuleSetModalOpen(true);
  };

  // copy ruleset method, action call in which selected ruleset is copied
  const confirmCopy = () => {
    dispatch(copyRuleset());
    setDeleteRuleSetModalOpen(false);
    toast.success('Ruleset Copied Successfully');
  };

  // save ruleset method, action call in which selected ruleset is saved
  const saveRulesetMethod = () => {
    dispatch(saveRuleset());
    dispatch(toggleEditMode());
    dispatch(selectRule(null));
    toast.success('Ruleset Saved Successfully');
  };

  // "on change event for ruleset name change"
  const handleRuleSetNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value) {
        dispatch(
          editRuleset({
            ...selectedRuleSet,
            id: selectedRuleSet?.id ?? 0,
            name: e.target.value?.toString(),
            rules: selectedRuleSet?.rules ?? [],
          })
        );
      }
    },
    [dispatch, selectedRuleSet]
  );

  return (
    <ErrorBoundary>
      <ToastContainer />
      <div className=" text-2xl p-4 p-4 m-4">
        <h1 className="text-4xl font-bold mb-2">
          Ruleset -{isEditing ? ' Edit Mode' : ' View Mode'}
        </h1>
        <div className="flex  gap-4">
          <div className="w-1/2">
            {!isEditing && <RulesetDropdown />}
            {isEditing && (
              <input
                value={selectedRuleSet?.name}
                type="text"
                className="border p-2 w-full"
                placeholder="Enter Ruleset Name"
                onChange={handleRuleSetNameChange}
              />
            )}
          </div>
          <div className="flex gap-2 mb-2 mt-2">
            {isEditing && (
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded"
                onClick={saveRulesetMethod}
              >
                Save Changes
              </button>
            )}
            {!isEditing && (
              <button
                className="bg-gray-300 text-black px-2 py-1 rounded"
                onClick={() => dispatch(toggleEditMode())}
              >
                Edit Rules
              </button>
            )}
            {!isEditing && (
              <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={confirmCopy}>
                Copy Ruleset
              </button>
            )}
            {isEditing && (
              <button
                className="bg-gray-300 text-black px-2 py-1 rounded"
                onClick={() => openCancelModal()}
              >
                Cancel
              </button>
            )}
            {isEditing && (
              <button
                className="bg-teal-500 text-white px-4 py-1 rounded"
                onClick={() =>
                  dispatch(
                    addRule({
                      id: Date.now(),
                      unitName: '',
                      findingName: '',
                      comparator: 'is',
                      measurement: '',
                      comparedValue: 'Not Present',
                      action: 'Normal',
                    })
                  )
                }
              >
                Add New Rule
              </button>
            )}
            {isEditing && (
              <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={openDeleteModal}>
                Delete Ruleset
              </button>
            )}
          </div>
        </div>
        {selectedRuleSet && <EnhancedRulesTable />}
        <ConfirmModal
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          onConfirm={confirmCancel}
          message="Are you sure you want to Cancel?"
          type="cancel"
        />
        <ConfirmModal
          isOpen={deleteRuleSetModal}
          onClose={() => setDeleteRuleSetModalOpen(false)}
          onConfirm={confirmDelete}
          message="Are you sure you want to Delete RuleSet?"
          type="delete"
        />
      </div>
    </ErrorBoundary>
  );
};

export default RulesPage;
