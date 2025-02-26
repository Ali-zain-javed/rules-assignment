import React, { useState, ComponentType, useCallback, useMemo, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import {
  addRule,
  deleteRule,
  reorderRules,
  selectRule,
  editRule,
  updateRule,
} from '../redux/rulesSlice';
import ConfirmDeleteModal from './ConfirmationModal';
import { useDrag, useDrop } from 'react-dnd';
import { RiDraggable } from 'react-icons/ri';
import IconComponent from './IconComponent';
import { MdOutlineEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { Rule } from '../redux/rulesSlice';
import { FaCheck } from 'react-icons/fa6';
import { RxCross2 } from 'react-icons/rx';
import { toast } from 'react-toastify';

const ItemType = 'RULE';

interface RulesTableProps {}

const DraggableRow: React.FC<{
  rule: any;
  index: number;
  moveRule: (dragIndex: number, hoverIndex: number) => void;
  handleDeleteClick: (ruleId: number) => void;
  isEditing: boolean;
  setEditRule: (rule: Rule) => void;
  selectedRule: Rule | null;
}> = memo(({ rule, index, moveRule, handleDeleteClick, isEditing, setEditRule, selectedRule }) => {
  const ref = React.useRef<HTMLTableRowElement>(null);

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveRule(item.index, index);
        item.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  if (isEditing) drag(drop(ref));

  return (
    <tr ref={ref} className="border cursor-move" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <td className="border-b p-1 w-6">
        <IconComponent
          icon={RiDraggable as ComponentType<{ size?: number; color?: string }>}
          size={20}
          color="black"
        />
      </td>
      <td className="border-b p-1 w-6">{index + 1}</td>
      <td className="border-b p-2">{rule.measurement}</td>
      <td className="border-b p-2">{rule.comparator}</td>
      <td className="border-b p-2">
        {rule.comparedValue} <span> {'   '}</span> {rule.unitName}
      </td>
      <td className="border-b p-2">{rule.findingName}</td>
      <td className="border-b p-2">Select "{rule.action}"</td>
      {isEditing && selectedRule?.id !== rule.id && (
        <td className="border-b p-2">
          <button className="text-red-500" onClick={() => setEditRule(rule)}>
            <IconComponent
              icon={
                MdOutlineEdit as ComponentType<{
                  size?: number;
                  color?: string;
                }>
              }
              size={20}
              color="black"
            />
          </button>
          <button className="text-red-500 ml-1" onClick={() => handleDeleteClick(rule.id)}>
            <IconComponent
              icon={MdDelete as ComponentType<{ size?: number; color?: string }>}
              size={20}
              color="black"
            />
          </button>
        </td>
      )}
    </tr>
  );
});

const RulesTable: React.FC<RulesTableProps> = () => {
  const dispatch = useDispatch();
  const ruleset = useSelector((state: RootState) => state.rules.selectedRuleset);
  const selectedRule = useSelector((state: RootState) => state.rules.selectedRule);
  const isEditing = useSelector((state: RootState) => state.rules.isEditing);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<number | null>(null);
  const handleDeleteClick = useCallback((ruleId: number) => {
    setRuleToDelete(ruleId);
    setDeleteModalOpen(true);
  }, []);

  //delete rule form ruleset
  const confirmDelete = useCallback(() => {
    if (ruleToDelete !== null) {
      dispatch(deleteRule(ruleToDelete));
      setRuleToDelete(null);
    }
    setDeleteModalOpen(false);
    toast.info('Rule Deleted Successfully');
  }, [dispatch, ruleToDelete]);

  // "move position rule in ruleset"
  const moveRule = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      dispatch(reorderRules({ dragIndex, hoverIndex }));
    },
    [dispatch]
  );

  // "edit selected rule"
  const setEditRule = useCallback(
    (rule: Rule) => {
      dispatch(selectRule(rule));
    },
    [dispatch]
  );

  // "update rule in actual selected rule set"
  const savedEditRule = useCallback(() => {
    if (selectedRule) {
      dispatch(updateRule({ ...selectedRule }));
      dispatch(selectRule(null));
    }
    toast.success('Rule Updated Successfully');
  }, [dispatch, selectedRule]);

  // "cancel edit rule"
  const cancelEditRule = useCallback(() => {
    dispatch(selectRule(null));
  }, [dispatch]);

  // "change measurement name ,action call for edit rule"
  const handleMeasurementChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (selectedRule) dispatch(editRule({ ...selectedRule, measurement: e.target.value }));
    },
    [dispatch, selectedRule]
  );

  // "change comparator name ,onChnage action call for edit rule"
  const handleComparatorChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (selectedRule) dispatch(editRule({ ...selectedRule, comparator: e.target.value }));
    },
    [dispatch, selectedRule]
  );

  // "change compared value name ,onChnage action call for edit rule"
  const handleComparedValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (selectedRule) dispatch(editRule({ ...selectedRule, comparedValue: e.target.value }));
    },
    [dispatch, selectedRule]
  );

  // "change finding name ,onChnage action call for edit rule"
  const handleFindingNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (selectedRule) dispatch(editRule({ ...selectedRule, findingName: e.target.value }));
    },
    [dispatch, selectedRule]
  );

  // "change unit name ,onChnage action call for edit rule"
  const handleUnitNameChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (selectedRule) dispatch(editRule({ ...selectedRule, unitName: e.target.value }));
    },
    [dispatch, selectedRule]
  );

  // "Change action name ,onChnage action call for edit rule"
  const handleActionChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (selectedRule) dispatch(editRule({ ...selectedRule, action: e.target.value }));
    },
    [dispatch, selectedRule]
  );

  const rules = useMemo(() => ruleset?.rules || [], [ruleset]);
  return (
    <div className="border p-4 rounded">
      <h2 className="text-xl font-semibold">{ruleset?.name}</h2>
      <table className="table-fixed border-separate border-spacing-0 w-full mt-4">
        <thead className="table-fixed">
          <tr className="bg-gray-200 ">
            <th className="w-12" colSpan={1}></th>
            <th className="border p-2 w-24">Rule #</th>
            <th className="border p-2" colSpan={3}>
              Measurement
            </th>
            <th className="border p-2">Finding Item</th>
            <th className="border p-2">Action</th>
            {isEditing && <th className="border p-2">Actions</th>}
          </tr>
        </thead>
        <tbody className="text-center">
          {rules.map((rule, index) => (
            <>
              {selectedRule?.id != rule.id && (
                <DraggableRow
                  key={rule.id}
                  rule={rule}
                  index={index}
                  moveRule={moveRule}
                  handleDeleteClick={handleDeleteClick}
                  isEditing={isEditing}
                  setEditRule={setEditRule}
                  selectedRule={selectedRule}
                />
              )}
              {isEditing && selectedRule && selectedRule?.id == rule?.id && (
                <tr className="border-b">
                  <td>
                    {' '}
                    <IconComponent
                      icon={
                        RiDraggable as ComponentType<{
                          size?: number;
                          color?: string;
                        }>
                      }
                      size={20}
                      color="black"
                    />
                  </td>
                  <td className="border-b p-2">{index + 1}</td>
                  <td className="border-b p-1">
                    <div className=" w-[280px]">
                      <input
                        type="text"
                        className="border p-2 rounded shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter Measurement Name"
                        value={selectedRule.measurement}
                        onChange={handleMeasurementChange}
                      />
                    </div>
                  </td>
                  <td className="border-b p-1 w-28">
                    <div className="inline-block relative w-24 ">
                      <select
                        className="border p-2 block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                        value={selectedRule.comparator}
                        onChange={handleComparatorChange}
                      >
                        <option value="is">is</option>
                        <option value=">=">{'>='}</option>
                        <option value="<">{'<'}</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </td>
                  <td className="border-b p-1">
                    <div className=" w-[380px] ml-[-70px] flex gap-2">
                      <input
                        type="text"
                        disabled={selectedRule.comparator == 'is' ? true : false}
                        className="border p-2 rounded shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={selectedRule.comparedValue}
                        onChange={handleComparedValueChange}
                        placeholder="Enter Compared Value"
                      />
                      {selectedRule.comparator != 'is' && (
                        <div className="inline-block relative w-48 ">
                          <select
                            className="border p-2 block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                            value={selectedRule.unitName}
                            onChange={handleUnitNameChange}
                          >
                            <option value="">Unit</option>
                            <option value="ms">ms</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg
                              className="fill-current h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="border-b p-1">
                    <div className="ml-[80px] w-[250px]">
                      <input
                        type="text"
                        className="border p-2 rounded shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={selectedRule.findingName}
                        onChange={handleFindingNameChange}
                        placeholder="Enter Finding Name"
                      />
                    </div>
                  </td>
                  <td className="border-b p-1">
                    <div className="inline-block relative w-40 ml-[95px]">
                      <select
                        className="border p-2 block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                        value={selectedRule.action}
                        onChange={handleActionChange}
                      >
                        <option value="Normal">Normal</option>
                        <option value="Reflux">Reflux</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </td>

                  {selectedRule?.id == rule.id && (
                    <td className="border-b p-2 flex gap-2 justify-center mt-6">
                      <button className="text-red-500 mb-4" onClick={savedEditRule}>
                        <IconComponent
                          icon={
                            FaCheck as ComponentType<{
                              size?: number;
                              color?: string;
                            }>
                          }
                          size={20}
                          color="black"
                        />
                      </button>
                      <button className="text-red-500 mb-4" onClick={cancelEditRule}>
                        <IconComponent
                          icon={
                            RxCross2 as ComponentType<{
                              size?: number;
                              color?: string;
                            }>
                          }
                          size={20}
                          color="black"
                        />
                      </button>
                    </td>
                  )}
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this rule?"
      />
    </div>
  );
};

export default RulesTable;
