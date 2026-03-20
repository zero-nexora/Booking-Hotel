import { useCountUp, type UseCountUpOptions } from "@/hooks/use-count-up";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export interface CountUpProps extends UseCountUpOptions {
  triggerOnView?: boolean;
  viewThreshold?: number;
  triggerOnce?: boolean;
  className?: string;
  style?: React.CSSProperties;
  render?: (state: {
    value: number;
    display: string;
    isDone: boolean;
  }) => React.ReactNode;
}

export const CountUp = ({
  triggerOnView = false,
  viewThreshold = 0.3,
  triggerOnce = true,
  autoStart = true,
  className,
  style,
  render,
  ...countUpOptions
}: CountUpProps) => {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLSpanElement>({
    threshold: viewThreshold,
    triggerOnce,
    enabled: triggerOnView,
  });

  const resolvedAutoStart = triggerOnView ? isIntersecting : autoStart;

  const { value, display, isDone } = useCountUp({
    ...countUpOptions,
    autoStart: resolvedAutoStart,
  });

  return (
    <span ref={ref} className={className} style={style}>
      {render ? render({ value, display, isDone }) : display}
    </span>
  );
}
