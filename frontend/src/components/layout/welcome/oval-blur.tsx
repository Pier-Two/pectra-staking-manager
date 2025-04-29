import type { SVGProps } from "react";

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={1058}
    height={479}
    fill="none"
    {...props}
  >
    <g filter="url(#a)" opacity={0.4}>
      <ellipse cx={529} cy={239.5} fill="#5164DC" rx={334} ry={44.5} />
    </g>
    <defs>
      <filter
        id="a"
        width={1058}
        height={479}
        x={0}
        y={0}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur
          result="effect1_foregroundBlur_10287_11726"
          stdDeviation={97.5}
        />
      </filter>
    </defs>
  </svg>
);
export default SvgComponent;
