import { ComponentClass, FunctionComponent, ReactNode } from 'react';
import { RouteProps } from 'react-router-dom';
import { CSSTransitionProps } from 'react-transition-group/CSSTransition';
export namespace White {
  // route

  // switch
  export type SwitchType = 'right' | 'bottom' | 'scroll' | 'fade';
  type TabBarType = {
    icon: string;
    title?: string;
  };
  export interface RouteConfig {
    routes?: RouteConfig[]; // 子列表
    tabBars?: RouteTabBar[];
    isTabIndex?: boolean;
    sceneMode?: SwitchType;
    title?: string;
    path: string;
    component: ComponentClass<any> | FunctionComponent<any>;
    exact?: boolean;
    strict?: boolean;
    sensitive?: boolean;
  }
  export interface RouteTabBar extends RouteConfig, TabBarType {
    highlight?: boolean;
    quickAction?: boolean;
  }

  // notice
  export interface NoticeProps {
    key?: string;
    content?: string;
    type: 'loading' | 'success' | 'fail' | 'warning' | 'info';
    duration: number;
    onClose?: () => void;
  }

  export interface NotifiCationRef {
    // add notice
    addNotice: (notice: NoticeProps) => () => void;
    // removeAll notice
    removeAll: () => void;
  }
  export interface NotifiCation extends NotifiCationRef {
    destroy: () => void;
  }
  export interface NotifiCationProps {
    transitionTime?: number;
    duration?: number;
  }

  export type AnimatedSwitchProps = Omit<
    CSSTransitionProps<any>,
    'addEndListener'
  > & {
    children?: ReactNode;
    primaryKey: string | number | null;
    type?: SwitchType;
    backClassName?: string;
    forwardClassName?: string;
  };

  export interface VirListProps {
    list: any[];
    itemH: number;
    itemRender: (key: any, val: any) => ReactNode;
    wrapNum?: number;
    loadMoreHieght?: number;
    height?: number;
    wrapperClass?: string;
    isEndLoad?: boolean;
    refreshHeight?: number;
    pageSize?: number;
  }
}
