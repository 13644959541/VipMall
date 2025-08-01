import { White } from '@/typings';
import React, { cloneElement, forwardRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './index.less';

interface AnimatedSwitchProps extends White.AnimatedSwitchProps {
  children: React.ReactElement;
}

const AnimatedSwitch = forwardRef<HTMLElement, AnimatedSwitchProps>(({
  children,
  classNames,
  primaryKey,
  timeout = 300,
  ...other
}, ref) => {
  return (
    <TransitionGroup
      childFactory={(child) => cloneElement(child, { classNames })}>
      <CSSTransition
        key={primaryKey}
        timeout={timeout}
        appear
        mountOnEnter
        unmountOnExit={false}
        nodeRef={ref}
        {...other}>
        {cloneElement(children, { ref })}
      </CSSTransition>
    </TransitionGroup>
  );
});

export default memo(AnimatedSwitch);
