// import { createContext, useContext, useReducer } from 'react';

// const DatabaseContext = createContext(null);

// const DatabaseDispatchContext = createContext(null);

// export function TasksProvider({ children }: { children: any}) {
//   const [tasks, dispatch] = useReducer(
//     tasksReducer,
//     initialTasks
//   );

//   return (
//     <DatabaseContext.Provider value={tasks}>
//       <DatabaseDispatchContext.Provider value={dispatch}>
//         {children}
//       </DatabaseDispatchContext.Provider>
//     </DatabaseContext.Provider>
//   );
// }

// export function useTasks() {
//   return useContext(DatabaseContext);
// }

// export function useTasksDispatch() {
//   return useContext(DatabaseDispatchContext);
// }

// function tasksReducer(tasks, action) {
//   switch (action.type) {
//     case 'added': {
//       return [...tasks, {
//         id: action.id,
//         text: action.text,
//         done: false
//       }];
//     }
//     case 'changed': {
//       return tasks.map(t => {
//         if (t.id === action.task.id) {
//           return action.task;
//         } else {
//           return t;
//         }
//       });
//     }
//     case 'deleted': {
//       return tasks.filter(t => t.id !== action.id);
//     }
//     default: {
//       throw Error('Unknown action: ' + action.type);
//     }
//   }
// }

// const initialTasks = [
//   { id: 0, text: 'Philosopher’s Path', done: true },
//   { id: 1, text: 'Visit the temple', done: false },
//   { id: 2, text: 'Drink matcha', done: false }
// ];
