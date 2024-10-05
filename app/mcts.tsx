export interface MCTSGameState {
  getNPlayers(): number;
  getCurrentPlayer(): number;
  applyAction(action: number): void;
  getLegalActions(): number[];
  clone(): MCTSGameState;
  isGameOver(): boolean;
  getValues(): number[]; // Array of results, one for each player
}

class MCTSNode {
  state: MCTSGameState;
  parent: MCTSNode | null;
  children: MCTSNode[];
  action: number | null;
  values: number[];
  visits: number;

  constructor(state: MCTSGameState, parent: MCTSNode | null = null, action: number | null = null) {

    const nPlayers = state.getNPlayers();
    this.state = state;
    this.parent = parent;
    this.children = [];
    this.action = action;
    this.values = new Array(nPlayers).fill(0);
    this.visits = 0;
  }
}

export function mcts(rootState: MCTSGameState, 
  timeLimitSeconds: number, 
  verbose : boolean = true): number {
  const root = new MCTSNode(rootState);

  const startTime = Date.now();
  while (Date.now() - startTime < timeLimitSeconds * 1000) {
  // for (let i = 0; i < 100; i++) {
    let node = root;
    
    while (!is_leaf(node)) {
      node = select(node);
    }

    if (node.visits > 0) {
      node = expand(node);
    }

    const values = simulate(node.state);

    backpropagate(node, values);
  }

  if (verbose === true) {
    // for each child of the node, print the action, value, and number of visits
    const activePlayer = root.state.getCurrentPlayer();
    root.children.forEach(child => 
      {
        console.log("Action: ", child.action);
        console.log("Value: ", child.values[activePlayer] );
        console.log("Visits: ", child.visits);
        console.log("Average value: ", child.values[activePlayer] / child.visits);
      });
  }

  // select child with most visits
  // const activePlayer = root.state.getCurrentPlayer();
  const bestChild = root.children.reduce((a, b) => (a.visits > b.visits ? a : b));
  if (bestChild.action === null) {
    return -1;
  } else {
    return bestChild.action;
  }

  // const bestChild = root.children.reduce((a, b) => (a.visits > b.visits ? a : b));
  // return bestChild.action || -1;
}

function is_leaf(node: MCTSNode): boolean {
  return node.children.length === 0;
}

function choice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function select(node: MCTSNode): MCTSNode {
  //  if any children are unvisited, return a random unvisited child
  const unvisitedChildren = node.children.filter(child => child.visits === 0);
  if (unvisitedChildren.length > 0) {
    return choice(unvisitedChildren);
  }

  // otherwise, calculate UCB1 for each child and return the child with the highest UCB1 value
  const ucb1Values = node.children.map(child => ucb1(node, child));
  const maxIndex = ucb1Values.indexOf(Math.max(...ucb1Values));
  return node.children[maxIndex];
}

function ucb1(parent: MCTSNode, child: MCTSNode): number {
  const activePlayer = parent.state.getCurrentPlayer();
  const exploitation = child.values[activePlayer] / child.visits;
  const exploration = Math.sqrt(2 * Math.log(parent.visits) / child.visits);
  return exploitation + exploration;
}

function expand(node: MCTSNode): MCTSNode {
  const legalActions = node.state.getLegalActions();

  if (legalActions.length === 0 || node.state.isGameOver()) {
    return node;
  }
  
  for (const action of legalActions) {
    const childState = node.state.clone();
    childState.applyAction(action);
    node.children.push(new MCTSNode(childState, node, action));
  }

  return choice(node.children);
}

function simulate(state: MCTSGameState): number[] {
  const childState = state.clone();
  
  while (!childState.isGameOver()) {
    const legalActions = childState.getLegalActions();
    const action = choice(legalActions);
    childState.applyAction(action);
  }
  return childState.getValues();
}

function backpropagate(node: MCTSNode, values: number[]): void {
  let currentNode: MCTSNode | null = node;
  const nPlayers = values.length;
  while (currentNode !== null) {
    currentNode.visits++;
    
    if (!currentNode.values) {
      currentNode.values = new Array(nPlayers).fill(0);
    }
    
    // Update values for all players
    for (let i = 0; i < nPlayers; i++) {
      currentNode.values[i] += values[i];
    }
    
    currentNode = currentNode.parent;
  }
}