import cn from 'classnames';
import { ReactComponent as BottomShapeSVG } from './assets/bottom-shape-3.svg';

type TProps = {
  className?: string;
  color?: string;
};

const BottomShape = ({ className, color = 'fill-white' }: TProps) => {
  return (
    <div className={cn('bottom-shape -z-1 absolute -bottom-px left-0 h-20 w-full rotate-180 md:h-[310px]', className)}>
      <BottomShapeSVG className={cn('rotate-y-180 h-full w-full', color)} />
    </div>
  );
};

export default BottomShape;
