export interface ConfigState {
  name: string;
  theme: string;
}

const initialConfigState: ConfigState = {
  name: 'Todo App',
  theme: 'light',
};

export default initialConfigState;
