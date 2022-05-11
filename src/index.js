const App = ({ actAs }) => {
  if (actAs === 'settings') {
    return (
      <div>
        Settings go here eventually
      </div>
    );
  }

  return null;
};

export default App;
export * from './public';
