import { Store } from "scalpeljs"; 

const initialState = { 
    cart: [],
    currentRoute: '/',
    user: { name: 'Guest'   }
};

// Second argument is the Options Object
export const store = new Store(initialState, {
  storageKey: 'my_scalpeljs_app', // Syncs state to LocalStorage
  debug: true                  // Enables component-trace logging
});


