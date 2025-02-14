import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ExplorationProgress } from './ExplorationProgress';
import { Link } from 'react-router-dom';
import { ConstraintInstance, WorkflowConfig } from '../../stores/WorkflowTypes';
import { useStore } from '../../store';
import { ConstraintTemplate } from '../../stores/ConstraintStore';
import { TreeNode, TreeSelectionBox } from '../TreeSelectionBox';
import { runInAction } from 'mobx';
import { ApeTaxTuple } from '../../stores/TaxStore';

const WorkflowConstraints: React.FC<any> = observer((props) => {
  let { exploreDataStore } = useStore();
  const workflowConfig: WorkflowConfig = exploreDataStore.workflowConfig;
  let { constraintStore } = useStore();
  const allConstraints: ConstraintTemplate[] = constraintStore.availableConstraints.filter(
    (constraint: ConstraintTemplate) => constraint.id === "use_m" || constraint.id === "nuse_m"
  );
  let { taxStore } = useStore();
  const allToolsTax: ApeTaxTuple = taxStore.availableToolTax;
  const allDataTax: ApeTaxTuple = taxStore.availableDataTax;

  React.useEffect(() => {
    if (workflowConfig.domain !== undefined) {
      constraintStore.fetchData(workflowConfig.domain.repo_url);
      taxStore.fetchData(workflowConfig.domain.repo_url);
    }
  }, [constraintStore, taxStore, workflowConfig.domain]);

  const addConstraint = () => {
    runInAction(() => {
      workflowConfig.constraints.push({ id: "", label: "", parameters: [
        taxStore.getEmptyTaxParameter(taxStore.availableToolTax)
      ]});
    });
  };

  const removeConstraint = () => {
    runInAction(() => {
      workflowConfig.constraints.pop();
    });
  };

  const onConstraintTypeChange = (constraintIndex: number, node: TreeNode) => {
    runInAction(() => {
      workflowConfig.constraints[constraintIndex] = node as unknown as ConstraintInstance;
    });
  };

  const onParameterChange = (constraintIndex: number, node: TreeNode, root: string) => {
    runInAction(() => {
      const parameterTuple: ApeTaxTuple = workflowConfig.constraints[constraintIndex].parameters[0];
      parameterTuple[root] = node;
    });
  };

  return (
    <div>

      <ExplorationProgress index={2} />

      <div className="m-8">
        <div className="text-left space-y-6 mt-10">

          {/* Status messages */}
          {constraintStore.isLoading && <div className="alert alert-info">Loading constraints...</div>}
          {taxStore.isLoading && <div className="alert alert-info">Loading tools...</div>}
          {workflowConfig.domain === undefined && <div className="alert alert-error">Domain could not be retrieved</div>}
          {constraintStore.error && <div className="alert alert-error">Constraints could not be retrieved ({constraintStore.error})</div>}
          {taxStore.error && <div className="alert alert-error">Tools could not be retrieved ({taxStore.error})</div>}

          {/* Constraints */}
          { !constraintStore.isLoading && !taxStore.isLoading && !constraintStore.error && !taxStore.error && 
            constraintStore.availableConstraints.length > 0 && Object.entries(allToolsTax).length > 0 &&
            <div className="flex items-center space-x-4">
              <span className="text-3xl flex-grow-0 w-40">Constraints</span>
              <div className="flex flex-grow items-center">
                {
                  workflowConfig.constraints.map((constraint: ConstraintInstance, index: number) => {
                    const root = "http://edamontology.org/operation_0004";
                    return (<div key={index}>
                      <TreeSelectionBox value={constraint} root={""}
                        nodes={allConstraints} onChange={(node: TreeNode) => onConstraintTypeChange(index, node)}
                        placeholder="Type of constraint" />

                      {constraint.id !== "" && constraint.parameters.length > 0 && 
                      <TreeSelectionBox 
                        value={constraint.parameters.length > 0 ? constraint.parameters[0][root] : { id: allToolsTax.id, label: allToolsTax.label, subsets: [] }}
                        nodes={allToolsTax[root].subsets}
                        root={root}
                        onChange={(node: TreeNode) => onParameterChange(index, node, root)}
                        placeholder="Operation" />}
                    </div>);
                  })
                }
                <button className="btn m-1 w-12 h-12 text-lg" onClick={() => addConstraint()}>+</button>
                <button className="btn m-1 w-12 h-12 text-lg" onClick={() => removeConstraint()}>-</button>
              </div >
            </div >
          }

          {/* Prev/next buttons */}
          < div className="flex justify-between p-10" >
            <Link to="/explore/inputs-outputs"><button className="btn btn-primary">Previous</button></Link>
            <Link to="/explore/configuration"><button className="btn btn-primary">Next</button></Link>
          </div >

        </div >
      </div >
    </div >
  );
});

export { WorkflowConstraints };
