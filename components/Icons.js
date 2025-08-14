import React from 'react';

export const PlusCircle = ({ className, size = 24 }) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className },
    React.createElement('circle', { cx: "12", cy: "12", r: "10" }),
    React.createElement('line', { x1: "12", y1: "8", x2: "12", y2: "16" }),
    React.createElement('line', { x1: "8", y1: "12", x2: "16", y2: "12" })
  )
);

export const LayoutDashboard = ({ className, size = 24 }) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className },
    React.createElement('rect', { x: "3", y: "3", width: "7", height: "9" }),
    React.createElement('rect', { x: "14", y: "3", width: "7", height: "5" }),
    React.createElement('rect', { x: "14", y: "12", width: "7", height: "9" }),
    React.createElement('rect', { x: "3", y: "16", width: "7", height: "5" })
  )
);

export const List = ({ className, size = 24 }) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className },
    React.createElement('line', { x1: "8", y1: "6", x2: "21", y2: "6" }),
    React.createElement('line', { x1: "8", y1: "12", x2: "21", y2: "12" }),
    React.createElement('line', { x1: "8", y1: "18", x2: "21", y2: "18" }),
    React.createElement('line', { x1: "3", y1: "6", x2: "3.01", y2: "6" }),
    React.createElement('line', { x1: "3", y1: "12", x2: "3.01", y2: "12" }),
    React.createElement('line', { x1: "3", y1: "18", x2: "3.01", y2: "18" })
  )
);

export const Edit2 = ({ className, size = 24 }) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className },
    React.createElement('path', { d: "M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" })
  )
);

export const Trash2 = ({ className, size = 24 }) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className },
    React.createElement('polyline', { points: "3 6 5 6 21 6" }),
    React.createElement('path', { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }),
    React.createElement('line', { x1: "10", y1: "11", x2: "10", y2: "17" }),
    React.createElement('line', { x1: "14", y1: "11", x2: "14", y2: "17" })
  )
);

export const Download = ({ className, size = 24 }) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className },
      React.createElement('path', { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
      React.createElement('polyline', { points: "7 10 12 15 17 10" }),
      React.createElement('line', { x1: "12", y1: "15", x2: "12", y2: "3" })
    )
);

export const Filter = ({ className, size = 24 }) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className },
      React.createElement('polygon', { points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" })
    )
);

export const Scan = ({ className, size = 24 }) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className },
    React.createElement('path', { d: "M3 7V5a2 2 0 0 1 2-2h2" }),
    React.createElement('path', { d: "M17 3h2a2 2 0 0 1 2 2v2" }),
    React.createElement('path', { d: "M21 17v2a2 2 0 0 1-2 2h-2" }),
    React.createElement('path', { d: "M7 21H5a2 2 0 0 1-2-2v-2" })
  )
);

export const Keyboard = ({ className, size = 24 }) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className },
      React.createElement('rect', { x: "3", y: "4", width: "18", height: "16", rx: "2", ry: "2" }),
      React.createElement('line', { x1: "7", y1: "9", x2: "7.01", y2: "9" }),
      React.createElement('line', { x1: "11", y1: "9", x2: "11.01", y2: "9" }),
      React.createElement('line', { x1: "15", y1: "9", x2: "15.01", y2: "9" }),
      React.createElement('line', { x1: "19", y1: "9", x2: "19.01", y2: "9" }),
      React.createElement('line', { x1: "7", y1: "13", x2: "7.01", y2: "13" }),
      React.createElement('line', { x1: "11", y1: "13", x2: "11.01", y2: "13" }),
      React.createElement('line', { x1: "15", y1: "13", x2: "15.01", y2: "13" }),
      React.createElement('line', { x1: "19", y1: "13", x2: "19.01", y2: "13" }),
      React.createElement('line', { x1: "9", y1: "17", x2: "15", y2: "17" })
    )
);

export const AlertTriangle = ({ className, size = 24 }) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className },
    React.createElement('path', { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }),
    React.createElement('line', { x1: "12", y1: "9", x2: "12", y2: "13" }),
    React.createElement('line', { x1: "12", y1: "17", x2: "12.01", y2: "17" })
  )
);

export const CheckCircle = ({ className, size = 24 }) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className },
    React.createElement('path', { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }),
    React.createElement('polyline', { points: "22 4 12 14.01 9 11.01" })
  )
);

export const Loader = ({ className, size = 24 }) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className },
    React.createElement('line', { x1: "12", y1: "2", x2: "12", y2: "6" }),
    React.createElement('line', { x1: "12", y1: "18", x2: "12", y2: "22" }),
    React.createElement('line', { x1: "4.93", y1: "4.93", x2: "7.76", y2: "7.76" }),
    React.createElement('line', { x1: "16.24", y1: "16.24", x2: "19.07", y2: "19.07" }),
    React.createElement('line', { x1: "2", y1: "12", x2: "6", y2: "12" }),
    React.createElement('line', { x1: "18", y1: "12", x2: "22", y2: "12" }),
    React.createElement('line', { x1: "4.93", y1: "19.07", x2: "7.76", y2: "16.24" }),
    React.createElement('line', { x1: "16.24", y1: "7.76", x2: "19.07", y2: "4.93" })
  )
);

export const Upload = ({ className, size = 24 }) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className },
    React.createElement('path', { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
    React.createElement('polyline', { points: "17 8 12 3 7 8" }),
    React.createElement('line', { x1: "12", y1: "3", x2: "12", y2: "15" })
  )
);

export const Camera = ({ className, size = 24 }) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className },
    React.createElement('path', { d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" }),
    React.createElement('circle', { cx: "12", cy: "13", r: "4" })
  )
);

export const CameraOff = ({ className, size = 24 }) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className },
    React.createElement('line', { x1: "1", y1: "1", x2: "23", y2: "23" }),
    React.createElement('path', { d: "M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56" })
  )
);

export const Power = ({ className, size = 24 }) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className },
    React.createElement('path', { d: "M18.36 6.64a9 9 0 1 1-12.73 0" }),
    React.createElement('line', { x1: "12", y1: "2", x2: "12", y2: "12" })
  )
);