export interface Computation {
  dependencies: Set<Set<Computation>>;
  execute: () => void;
}