import React from 'react';

export const TabsContext = React.createContext({
  lang: 'tw',
  setLang: () => {},
});
const TabsProvider = (props) => {
  const [lang, setLang] = React.useState('tw');
  return (
    <TabsContext.Provider value={[lang, setLang]}>
      {props.children}
    </TabsContext.Provider>
  );
};

export const withContext = (Component) => (props) => {
  return (
    <TabsProvider>
      <Component {...props} />
    </TabsProvider>
  );
};
export default TabsProvider;
