import { Store } from "pullstate";

export const UIStore = new Store({
  isLoggedin: localStorage.getItem('token'),
  tripDeleted: 'false',
});
