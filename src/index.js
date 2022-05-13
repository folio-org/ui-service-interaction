import ServintSettings from './settings';

const App = (appProps) => {
  const { actAs } = appProps;

  if (actAs === 'settings') {
    return (
      <ServintSettings {...appProps} />
    );
  }

  return null;
};

export default App;
export * from './public';
