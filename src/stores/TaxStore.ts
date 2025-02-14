import { makeAutoObservable, runInAction } from "mobx";

/**
 * The class represents a taxonomy class, that either represents an operation or a data dimension. 
 * A class can have a list of subsets, which are also taxonomy classes. Which forms the taxonomy.
 */
export interface TaxonomyClass {
  id: string;
  label: string;
  root: string;
  subsets: Array<TaxonomyClass> | [];
}

/**
 * The type represents a data/operation touple used in APE configuration. It represents either an operation, or a data instance class (obtained from a taxonomy).
 * In each case it comprises of a map of dimensions to taxonomy classes used to depict the given dimension. 
 * 
 * Note: In case of the operation there is only one dimension of data. 
 */
export type ApeTaxTuple = { [key: string]: TaxonomyClass };

/**
 * The class represents a store for the taxonomy data. It is used to store the data on operation and data taxonomies,
 * used as vocabularies in the APE configuration.
 */
export class TaxStore {

  /** Tool root mapped to its taxonomy. */
  availableToolTax: ApeTaxTuple = {};
  /** Data roots mapped to their respective taxonomies. */
  availableDataTax: ApeTaxTuple = {};
  /** List of data dimensions. */
  isLoading: boolean = false;
  error: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Fetches data on operation and data taxonomies from the server.
   * @param config_path The path to the APE configuration file.
   */
  async fetchData(config_path: string) {
    this.fetchDataDimensions(config_path);
    this.fetchTools(config_path);
  }

  async fetchTools(config_path: string) {
    this.isLoading = true;
    this.error = "";

    const responseOperations = await fetch(`/ape/get_tools?config_path=${config_path}`);
    const resultOperations = await responseOperations.json();
    runInAction(() => {
      this.isLoading = false;
      if (resultOperations.error !== undefined) {
        this.error = resultOperations.error;
      }
      else {
        const taxMap: ApeTaxTuple = {
          [resultOperations.id]: resultOperations
        };
        this.availableToolTax = taxMap;
      }
    });
  }

  async fetchDataDimensions(config_path: string) {
    const responseData = await fetch(`/ape/get_data?config_path=${config_path}`);
    const resultData = await responseData.json();
    runInAction(() => {
      this.isLoading = false;
      if (resultData.error !== undefined) {
        this.error = resultData.error;
      }
      else {
        const taxMap: ApeTaxTuple = {};
        for (let dataTax of resultData) {
          taxMap[dataTax.id] = dataTax;
        }
        this.availableDataTax = taxMap;
      }
    });

  }

  getEmptyTaxParameter(root: ApeTaxTuple): ApeTaxTuple {
    const emptyTaxParameter: ApeTaxTuple = {};
    for (let taxRoot of Object.values(root)) {
      emptyTaxParameter[taxRoot.id] = { id: taxRoot.id, label: taxRoot.label, root: taxRoot.root, subsets: [] };
    }
    return emptyTaxParameter;
  }

}

const taxStore = new TaxStore();
export default taxStore;
