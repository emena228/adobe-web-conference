import { TransitionGroup, Transition as ReactTransition } from "react-transition-group";

const TIMEOUT = 1250;
const getTransitionStyles = {
  entering: {
    opacity: 0,
    maxWidth: "100vw",
    maxHeight: "100vh",
  },
  entered: {
    transition: `opacity ${TIMEOUT}ms ease-in-out`,
    opacity: 1,
    maxWidth: "100vw",
    maxHeight: "100vh",
  },
  exiting: {
    transition: `opacity ${TIMEOUT}ms ease-in-out`,
    opacity: 0,
    maxWidth: "100vw",
    maxHeight: "100vh",
  },
};
const Transition = ({ children, location }) => {
  return (
    <TransitionGroup>
      <ReactTransition key={location} timeout={{ enter: TIMEOUT, exit: TIMEOUT }}>
        {(status) => {
          return (
            <div
              style={{
                ...getTransitionStyles[status],
              }}
            >
              {children}
            </div>
          );
        }}
      </ReactTransition>
    </TransitionGroup>
  );
};
export default Transition;
