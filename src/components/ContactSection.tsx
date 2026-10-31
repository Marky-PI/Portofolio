import * as React from 'react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check, Linkedin, Mail, Phone } from 'lucide-react';
import { PROFILE_DATA } from '../data/portfolioData';
import {
  validateContactForm,
  type ContactFormInput,
} from '../utils/portfolioLogic';

function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

const smoothEase = [0.25, 0.1, 0.25, 1] as const;

const CONTACT_LINKS = [
  {
    icon: Mail,
    label: PROFILE_DATA.email,
    href: `mailto:${PROFILE_DATA.email}`,
    external: false,
  },
  {
    icon: Phone,
    label: '+62-8515-8807-170',
    href: 'tel:+6285158807170',
    external: false,
  },
  {
    icon: Linkedin,
    label: 'linkedin.com/in/mahesa-rizky',
    href: 'https://www.linkedin.com/in/mahesa-rizky',
    external: true,
  },
];

interface GlobeWireframeProps {
  width?: number;
  height?: number;
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
  graticuleColor?: string;
  graticuleOpacity?: number;
  sphereOutlineColor?: string;
  sphereOutlineWidth?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  rotateToLocation?: string | [number, number];
  rotateCities?: string[];
  rotationSpeed?: number;
  initialRotation?: [number, number];
  enableInteraction?: boolean;
  showGraticule?: boolean;
  animationDuration?: number;
  startAsGlobe?: boolean;
  countryFillColor?: string;
  countryHoverColor?: string;
  variant?: 'wireframe' | 'wireframesolid' | 'solid';
  scale?: number;
  backgroundColor?: string;
}

type RingCoords = Array<[number, number]>;
type PolygonCoords = RingCoords[];
type MultiPolygonCoords = PolygonCoords[];

interface GeoGeometry {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: PolygonCoords | MultiPolygonCoords;
}

interface GeoFeature {
  type: string;
  geometry: GeoGeometry;
  properties: Record<string, unknown>;
}

interface TopologyTransform {
  scale: [number, number];
  translate: [number, number];
}

interface TopologyGeometry {
  type: 'Polygon' | 'MultiPolygon' | string;
  arcs?: number[][] | number[][][];
  properties?: Record<string, unknown>;
}

interface WorldAtlasTopology {
  type: 'Topology';
  transform?: TopologyTransform;
  arcs: number[][][];
  objects: {
    countries: {
      type: string;
      geometries: TopologyGeometry[];
    };
  };
}

const cityCoordinates: Record<string, [number, number]> = {
  'san francisco': [37.7749, -122.4194],
  'new york': [40.7128, -74.006],
  london: [51.5074, -0.1278],
  tokyo: [35.6762, 139.6503],
  paris: [48.8566, 2.3522],
  moscow: [55.7558, 37.6176],
  dubai: [25.2048, 55.2708],
  singapore: [1.3521, 103.8198],
  jakarta: [-6.2088, 106.8456],
  semarang: [-6.9667, 110.4167],
  sydney: [-33.8688, 151.2093],
  mumbai: [19.076, 72.8777],
  'los angeles': [34.0522, -118.2437],
  chicago: [41.8781, -87.6298],
};

// Detailed fallback world landmass outlines so the globe renders immediately even offline
const FALLBACK_WORLD_FEATURES: GeoFeature[] = [
  // North America
  {
    type: 'Feature',
    properties: { name: 'North America' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-165, 65], [-140, 70], [-110, 72], [-80, 68], [-62, 60],
          [-55, 48], [-70, 42], [-76, 35], [-81, 25], [-90, 21],
          [-84, 10], [-78, 8], [-85, 12], [-95, 17], [-105, 22],
          [-115, 30], [-124, 42], [-132, 54], [-150, 60], [-165, 65],
        ],
      ],
    },
  },
  // Greenland
  {
    type: 'Feature',
    properties: { name: 'Greenland' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-55, 60], [-44, 60], [-22, 70], [-18, 81], [-45, 83],
          [-65, 78], [-55, 60],
        ],
      ],
    },
  },
  // South America
  {
    type: 'Feature',
    properties: { name: 'South America' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-78, 9], [-62, 10], [-50, 1], [-35, -6], [-38, -15],
          [-42, -23], [-52, -33], [-62, -40], [-68, -54], [-74, -50],
          [-72, -35], [-70, -18], [-81, -5], [-78, 9],
        ],
      ],
    },
  },
  // Europe
  {
    type: 'Feature',
    properties: { name: 'Europe' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-9, 37], [-9, 43], [-2, 44], [-4, 48], [2, 51], [8, 54],
          [5, 60], [12, 66], [26, 71], [40, 67], [55, 60], [50, 46],
          [38, 45], [28, 41], [24, 38], [15, 38], [12, 44], [5, 43],
          [-5, 36], [-9, 37],
        ],
      ],
    },
  },
  // United Kingdom
  {
    type: 'Feature',
    properties: { name: 'UK' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-6, 50], [1, 51], [-1, 55], [-5, 58], [-6, 54], [-6, 50],
        ],
      ],
    },
  },
  // Africa
  {
    type: 'Feature',
    properties: { name: 'Africa' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-6, 35], [10, 37], [22, 33], [33, 31], [40, 18], [51, 12],
          [41, -2], [40, -14], [35, -24], [28, -33], [18, -34],
          [14, -22], [12, -8], [9, 4], [-7, 5], [-17, 15], [-14, 26],
          [-6, 35],
        ],
      ],
    },
  },
  // Madagascar
  {
    type: 'Feature',
    properties: { name: 'Madagascar' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [49, -12], [50, -18], [47, -25], [44, -24], [45, -16], [49, -12],
        ],
      ],
    },
  },
  // Asia
  {
    type: 'Feature',
    properties: { name: 'Asia' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [36, 37], [48, 30], [56, 26], [62, 25], [72, 21], [78, 8],
          [85, 16], [90, 22], [98, 16], [102, 2], [104, 1], [109, 12],
          [108, 21], [121, 24], [123, 32], [128, 35], [135, 45],
          [142, 53], [160, 60], [178, 66], [140, 73], [105, 76],
          [75, 72], [58, 68], [55, 50], [42, 42], [36, 37],
        ],
      ],
    },
  },
  // Indonesia & Maritime Southeast Asia
  {
    type: 'Feature',
    properties: { name: 'Sumatra' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [95, 5.5], [99, 3], [104, -2], [106, -6], [102, -4], [95, 5.5],
        ],
      ],
    },
  },
  {
    type: 'Feature',
    properties: { name: 'Java' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [105.5, -6], [110.4, -6.9], [114.5, -8], [113, -8.7],
          [106, -7.2], [105.5, -6],
        ],
      ],
    },
  },
  {
    type: 'Feature',
    properties: { name: 'Kalimantan' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [109, 1], [117, 6], [119, 1], [116, -4], [110, -3], [109, 1],
        ],
      ],
    },
  },
  {
    type: 'Feature',
    properties: { name: 'Sulawesi & Papua' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [131, -1], [141, -2.5], [149, -6], [147, -9], [138, -8],
          [132, -4], [131, -1],
        ],
      ],
    },
  },
  // Japan
  {
    type: 'Feature',
    properties: { name: 'Japan' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [130, 32], [136, 34], [141, 38], [145, 43], [140, 41],
          [135, 36], [130, 32],
        ],
      ],
    },
  },
  // Australia
  {
    type: 'Feature',
    properties: { name: 'Australia' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [114, -22], [122, -17], [131, -12], [136, -12], [142, -11],
          [150, -22], [153, -28], [150, -37], [140, -38], [131, -32],
          [122, -34], [115, -34], [113, -26], [114, -22],
        ],
      ],
    },
  },
  // New Zealand
  {
    type: 'Feature',
    properties: { name: 'New Zealand' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [173, -35], [178, -38], [174, -42], [167, -46], [170, -43],
          [173, -35],
        ],
      ],
    },
  },
];

function extractCountriesFromTopology(world: WorldAtlasTopology): GeoFeature[] {
  if (!world?.arcs || !world?.objects?.countries?.geometries) {
    return FALLBACK_WORLD_FEATURES;
  }

  const scaleX = world.transform ? world.transform.scale[0] : 1;
  const scaleY = world.transform ? world.transform.scale[1] : 1;
  const transX = world.transform ? world.transform.translate[0] : 0;
  const transY = world.transform ? world.transform.translate[1] : 0;

  const decodedArcs: RingCoords[] = world.arcs.map((arc) => {
    let x = 0;
    let y = 0;
    return arc.map((pt) => {
      x += pt[0];
      y += pt[1];
      return [x * scaleX + transX, y * scaleY + transY] as [number, number];
    });
  });

  const decodeRing = (arcIndices: number[]): RingCoords => {
    const coords: RingCoords = [];
    for (const index of arcIndices) {
      const arc =
        index >= 0
          ? decodedArcs[index]
          : decodedArcs[~index]
            ? [...decodedArcs[~index]].reverse()
            : [];
      for (let i = 0; i < arc.length; i++) {
        if (i === 0 && coords.length > 0) continue;
        coords.push(arc[i]);
      }
    }
    return coords;
  };

  const features: GeoFeature[] = [];
  for (const geom of world.objects.countries.geometries) {
    if (geom.type === 'Polygon' && Array.isArray(geom.arcs)) {
      const rings = (geom.arcs as number[][]).map(decodeRing);
      features.push({
        type: 'Feature',
        properties: geom.properties || {},
        geometry: {
          type: 'Polygon',
          coordinates: rings,
        },
      });
    } else if (geom.type === 'MultiPolygon' && Array.isArray(geom.arcs)) {
      const polys = (geom.arcs as number[][][]).map((polyArcs) =>
        polyArcs.map(decodeRing),
      );
      features.push({
        type: 'Feature',
        properties: geom.properties || {},
        geometry: {
          type: 'MultiPolygon',
          coordinates: polys,
        },
      });
    }
  }

  return features.length > 0 ? features : FALLBACK_WORLD_FEATURES;
}

const DEG_TO_RAD = Math.PI / 180;

function orthographicRaw(x: number, y: number): [number, number] {
  const cosy = Math.cos(y);
  return [cosy * Math.sin(x), Math.sin(y)];
}

function equirectangularRaw(lambda: number, phi: number): [number, number] {
  return [lambda, phi];
}

interface ProjectedVertex {
  sx: number;
  sy: number;
  z: number;
  ux: number;
  uy: number;
  uz: number;
}

function projectPoint3D(
  lonDeg: number,
  latDeg: number,
  rotLonDeg: number,
  rotLatDeg: number,
  scaleVal: number,
  cx: number,
  cy: number,
  alpha = 0,
): ProjectedVertex {
  const lambda = (lonDeg + rotLonDeg) * DEG_TO_RAD;
  const phi = latDeg * DEG_TO_RAD;
  const gamma = rotLatDeg * DEG_TO_RAD;

  // Spherical unit vector rotated by longitude (lambda) and latitude tilt (gamma)
  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);
  const cosLambda = Math.cos(lambda);
  const sinLambda = Math.sin(lambda);
  const cosGamma = Math.cos(gamma);
  const sinGamma = Math.sin(gamma);

  // Forward hemisphere normal is +uz
  const ux = cosPhi * sinLambda;
  const uy = sinPhi * cosGamma + cosPhi * cosLambda * sinGamma;
  const uz = cosPhi * cosLambda * cosGamma - sinPhi * sinGamma;

  if (alpha > 0.001) {
    const [ox, oy] = [ux, uy];
    const [ex, ey] = equirectangularRaw(
      ((((lonDeg + rotLonDeg + 540) % 360) - 180) * DEG_TO_RAD),
      phi,
    );
    const px = ox + alpha * (ex - ox);
    const py = oy + alpha * (ey - oy);
    return {
      sx: cx + px * scaleVal,
      sy: cy - py * scaleVal,
      z: alpha > 0.5 ? 1 : uz,
      ux,
      uy,
      uz,
    };
  }

  return {
    sx: cx + ux * scaleVal,
    sy: cy - uy * scaleVal,
    z: uz,
    ux,
    uy,
    uz,
  };
}

function buildRingSvgPath(
  ring: RingCoords,
  rotLonDeg: number,
  rotLatDeg: number,
  scaleVal: number,
  cx: number,
  cy: number,
  alpha = 0,
): string {
  if (ring.length < 2) return '';
  let d = '';
  let penDown = false;
  let prev: ProjectedVertex | null = null;

  for (let i = 0; i < ring.length; i++) {
    const [lon, lat] = ring[i];
    const curr = projectPoint3D(
      lon,
      lat,
      rotLonDeg,
      rotLatDeg,
      scaleVal,
      cx,
      cy,
      alpha,
    );

    if (curr.z >= 0) {
      if (prev && prev.z < 0 && alpha <= 0.5) {
        // Interpolate horizon crossing where z === 0
        const t = prev.z / (prev.z - curr.z);
        let hx = prev.ux + t * (curr.ux - prev.ux);
        let hy = prev.uy + t * (curr.uy - prev.uy);
        const norm = Math.hypot(hx, hy) || 1;
        hx /= norm;
        hy /= norm;
        const hsx = cx + hx * scaleVal;
        const hsy = cy - hy * scaleVal;
        d += `M${hsx.toFixed(1)},${hsy.toFixed(1)}L${curr.sx.toFixed(1)},${curr.sy.toFixed(1)}`;
        penDown = true;
      } else if (!penDown) {
        d += `M${curr.sx.toFixed(1)},${curr.sy.toFixed(1)}`;
        penDown = true;
      } else {
        // Guard against wraparound jumps when alpha > 0
        if (
          prev &&
          Math.hypot(curr.sx - prev.sx, curr.sy - prev.sy) > scaleVal * 1.45
        ) {
          d += `M${curr.sx.toFixed(1)},${curr.sy.toFixed(1)}`;
        } else {
          d += `L${curr.sx.toFixed(1)},${curr.sy.toFixed(1)}`;
        }
      }
    } else {
      if (prev && prev.z >= 0 && penDown && alpha <= 0.5) {
        const t = prev.z / (prev.z - curr.z);
        let hx = prev.ux + t * (curr.ux - prev.ux);
        let hy = prev.uy + t * (curr.uy - prev.uy);
        const norm = Math.hypot(hx, hy) || 1;
        hx /= norm;
        hy /= norm;
        const hsx = cx + hx * scaleVal;
        const hsy = cy - hy * scaleVal;
        d += `L${hsx.toFixed(1)},${hsy.toFixed(1)}`;
      }
      penDown = false;
    }

    prev = curr;
  }

  return d;
}

function buildFeatureSvgPath(
  featureItem: GeoFeature,
  rotLonDeg: number,
  rotLatDeg: number,
  scaleVal: number,
  cx: number,
  cy: number,
  alpha = 0,
): string {
  const { geometry } = featureItem;
  if (!geometry) return '';

  if (geometry.type === 'Polygon') {
    const rings = geometry.coordinates as PolygonCoords;
    return rings
      .map((ring) =>
        buildRingSvgPath(ring, rotLonDeg, rotLatDeg, scaleVal, cx, cy, alpha),
      )
      .filter(Boolean)
      .join('');
  }

  if (geometry.type === 'MultiPolygon') {
    const polys = geometry.coordinates as MultiPolygonCoords;
    return polys
      .map((rings) =>
        rings
          .map((ring) =>
            buildRingSvgPath(
              ring,
              rotLonDeg,
              rotLatDeg,
              scaleVal,
              cx,
              cy,
              alpha,
            ),
          )
          .filter(Boolean)
          .join(''),
      )
      .filter(Boolean)
      .join('');
  }

  return '';
}

function buildGraticuleSvgPath(
  rotLonDeg: number,
  rotLatDeg: number,
  scaleVal: number,
  cx: number,
  cy: number,
  alpha = 0,
): string {
  const paths: string[] = [];

  // Meridians every 15 degrees
  for (let lon = -180; lon < 180; lon += 15) {
    const ring: RingCoords = [];
    for (let lat = -80; lat <= 80; lat += 5) {
      ring.push([lon, lat]);
    }
    const p = buildRingSvgPath(
      ring,
      rotLonDeg,
      rotLatDeg,
      scaleVal,
      cx,
      cy,
      alpha,
    );
    if (p) paths.push(p);
  }

  // Parallels every 15 degrees
  for (let lat = -75; lat <= 75; lat += 15) {
    const ring: RingCoords = [];
    for (let lon = -180; lon <= 180; lon += 5) {
      ring.push([lon, lat]);
    }
    const p = buildRingSvgPath(
      ring,
      rotLonDeg,
      rotLatDeg,
      scaleVal,
      cx,
      cy,
      alpha,
    );
    if (p) paths.push(p);
  }

  return paths.join('');
}

export function GlobeWireframe({
  width,
  height,
  className = 'aspect-square w-full max-w-150',
  strokeColor = 'currentColor',
  strokeWidth = 1.0,
  graticuleColor = 'currentColor',
  graticuleOpacity = 0.2,
  sphereOutlineColor = 'currentColor',
  sphereOutlineWidth = 1,
  autoRotate = true,
  autoRotateSpeed = 0.5,
  rotateToLocation,
  rotateCities = [],
  rotationSpeed = 3000,
  initialRotation = [-110, 6],
  enableInteraction = true,
  showGraticule = true,
  startAsGlobe = true,
  countryFillColor,
  countryHoverColor,
  variant = 'wireframe',
  scale = 1,
  backgroundColor,
}: GlobeWireframeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress] = useState(startAsGlobe ? 0 : 100);
  const [worldData, setWorldData] = useState<GeoFeature[]>(
    FALLBACK_WORLD_FEATURES,
  );
  const [rotation, setRotation] = useState<[number, number]>(initialRotation);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState([0, 0]);
  const [isVisible, setIsVisible] = useState(true);
  const rotationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const rotationAnimFrame = useRef<number | null>(null);
  const rotationStartTime = useRef<number | null>(null);
  const rotationFrom = useRef<[number, number]>([0, 0]);
  const rotationTo = useRef<[number, number]>([0, 0]);
  const animationFrame = useRef<number | null>(null);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const rotationRef = useRef(rotation);

  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  const useResponsive = !width && !height;
  const finalWidth = useResponsive ? dimensions.width : width || 800;
  const finalHeight = useResponsive ? dimensions.height : height || 500;

  const defaultStrokeColor = strokeColor || 'currentColor';
  const defaultGraticuleColor = graticuleColor || 'currentColor';
  const defaultSphereOutlineColor = sphereOutlineColor || 'currentColor';
  const defaultCountryFillColor =
    countryFillColor || (variant === 'solid' ? 'currentColor' : 'none');
  const defaultBackgroundColor = backgroundColor || 'transparent';

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const updateDimensions = () => {
      if (container && useResponsive) {
        const w = container.offsetWidth || 360;
        setDimensions({ width: w, height: w });
      }
    };

    updateDimensions();

    if (useResponsive && typeof ResizeObserver !== 'undefined') {
      resizeObserver.current = new ResizeObserver(updateDimensions);
      resizeObserver.current.observe(container);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 },
    );

    observer.observe(container);

    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
      observer.unobserve(container);
    };
  }, [useResponsive]);

  useEffect(() => {
    let isMounted = true;
    const loadWorldData = async () => {
      try {
        const response = await fetch(
          'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json',
        );
        if (!response.ok) return;
        const world = (await response.json()) as WorldAtlasTopology;
        const countries = extractCountriesFromTopology(world);
        if (isMounted && countries.length > 0) {
          setWorldData(countries);
        }
      } catch {
        // Fallback world landmass polygons remain active
      }
    };
    loadWorldData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!autoRotate || !isVisible || isDragging || rotateCities.length > 0) {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }
      return;
    }

    const rotate = () => {
      setRotation((prev) => [(prev[0] + autoRotateSpeed) % 360, prev[1]]);
      animationFrame.current = requestAnimationFrame(rotate);
    };

    animationFrame.current = requestAnimationFrame(rotate);

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [autoRotate, autoRotateSpeed, isVisible, isDragging, rotateCities.length]);

  const animateRotationTo = useCallback(
    (target: [number, number], duration = 1200) => {
      if (rotationAnimFrame.current) {
        cancelAnimationFrame(rotationAnimFrame.current);
      }

      rotationFrom.current = rotationRef.current;
      rotationTo.current = target;
      rotationStartTime.current = performance.now();

      const animate = (time: number) => {
        const elapsed = time - (rotationStartTime.current || 0);
        const t = Math.min(elapsed / duration, 1);

        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

        const lon =
          rotationFrom.current[0] +
          (rotationTo.current[0] - rotationFrom.current[0]) * eased;

        const lat =
          rotationFrom.current[1] +
          (rotationTo.current[1] - rotationFrom.current[1]) * eased;

        setRotation([lon, lat]);

        if (t < 1) {
          rotationAnimFrame.current = requestAnimationFrame(animate);
        }
      };

      rotationAnimFrame.current = requestAnimationFrame(animate);
    },
    [],
  );

  useEffect(() => {
    if (rotateCities.length === 0 || !isVisible) return;

    const rotateToNextCity = () => {
      const nextIndex = (currentCityIndex + 1) % rotateCities.length;
      const city = rotateCities[nextIndex].toLowerCase();
      const coordinates = cityCoordinates[city];

      if (coordinates) {
        animateRotationTo(
          [-coordinates[1], -coordinates[0]],
          rotationSpeed * 0.6,
        );
        setCurrentCityIndex(nextIndex);
      }
    };

    const city = rotateCities[currentCityIndex].toLowerCase();
    const coordinates = cityCoordinates[city];

    if (coordinates) {
      animateRotationTo(
        [-coordinates[1], -coordinates[0]],
        rotationSpeed * 0.6,
      );
    }

    rotationInterval.current = setInterval(rotateToNextCity, rotationSpeed);

    return () => {
      if (rotationInterval.current) clearInterval(rotationInterval.current);
    };
  }, [
    rotateCities,
    currentCityIndex,
    rotationSpeed,
    isVisible,
    animateRotationTo,
  ]);

  useEffect(() => {
    if (!rotateToLocation) return;

    let coordinates: [number, number];
    if (typeof rotateToLocation === 'string') {
      const city = rotateToLocation.toLowerCase();
      coordinates = cityCoordinates[city] || [0, 0];
    } else {
      coordinates = rotateToLocation;
    }

    setRotation([-coordinates[1], -coordinates[0]]);
  }, [rotateToLocation]);

  const handleMouseDown = (event: React.MouseEvent) => {
    if (!enableInteraction) return;
    setIsDragging(true);
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      setLastMouse([event.clientX - rect.left, event.clientY - rect.top]);
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !enableInteraction) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentMouse = [event.clientX - rect.left, event.clientY - rect.top];
    const dx = currentMouse[0] - lastMouse[0];
    const dy = currentMouse[1] - lastMouse[1];

    const t = progress / 100;
    const sensitivity =
      variant === 'wireframe' ? (t < 0.5 ? 0.5 : 0.25) : 0.5;

    setRotation((prev) => [
      prev[0] + dx * sensitivity,
      Math.max(-90, Math.min(90, prev[1] - dy * sensitivity)),
    ]);

    setLastMouse(currentMouse);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Compute SVG geometry parameters matching 21st.dev GlobeWireframe
  const baseScale = Math.min(finalWidth, finalHeight) / 2;
  const t = progress / 100;
  const alpha = variant === 'wireframe' ? Math.pow(t, 0.5) : 0;
  const activeScale =
    variant === 'wireframe'
      ? (baseScale * 0.9 - alpha * baseScale * 0.36) * scale
      : baseScale * 0.9 * scale;
  const cx = finalWidth / 2;
  const cy = finalHeight / 2;

  let finalCountryFill = 'none';
  let finalStrokeWidth = strokeWidth;
  let finalOpacity = 1.0;
  let renderGraticule = showGraticule;
  let finalGraticuleOpacity = graticuleOpacity;
  let finalSphereOutlineWidth = sphereOutlineWidth;

  if (variant === 'wireframesolid') {
    finalCountryFill = 'none';
    finalStrokeWidth = strokeWidth;
    finalOpacity = 1.0;
    renderGraticule = false;
    finalGraticuleOpacity = 0;
    finalSphereOutlineWidth = 1.5;
  } else if (variant === 'solid') {
    finalCountryFill = defaultCountryFillColor;
    finalStrokeWidth = strokeWidth * 0.5;
    finalOpacity = 0.3;
    renderGraticule = false;
    finalGraticuleOpacity = 0;
    finalSphereOutlineWidth = 1.5;
  }

  const graticulePathData =
    renderGraticule && finalGraticuleOpacity > 0 && finalWidth > 0
      ? buildGraticuleSvgPath(
          rotation[0],
          rotation[1],
          activeScale,
          cx,
          cy,
          alpha,
        )
      : '';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <svg
        ref={svgRef}
        width={finalWidth || 360}
        height={finalHeight || 360}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={
          useResponsive
            ? 'w-full h-full transition-opacity duration-700'
            : ''
        }
        style={{
          cursor: enableInteraction
            ? isDragging
              ? 'grabbing'
              : 'grab'
            : 'default',
          opacity: useResponsive ? (dimensions.width > 0 ? 1 : 0) : 1,
        }}
      >
        {defaultBackgroundColor !== 'transparent' && activeScale > 0 && (
          <circle
            cx={cx}
            cy={cy}
            r={activeScale}
            fill={defaultBackgroundColor}
          />
        )}

        {graticulePathData && (
          <path
            d={graticulePathData}
            fill="none"
            stroke={defaultGraticuleColor}
            strokeWidth={1}
            opacity={finalGraticuleOpacity}
          />
        )}

        {finalWidth > 0 &&
          worldData.map((featureItem, index) => {
            const pathString = buildFeatureSvgPath(
              featureItem,
              rotation[0],
              rotation[1],
              activeScale,
              cx,
              cy,
              alpha,
            );
            if (!pathString) return null;
            return (
              <path
                key={index}
                className="country"
                d={pathString}
                fill={finalCountryFill}
                stroke={defaultStrokeColor}
                strokeWidth={finalStrokeWidth}
                opacity={finalOpacity}
                onMouseEnter={(e) => {
                  if (countryHoverColor && variant === 'solid') {
                    e.currentTarget.setAttribute('fill', countryHoverColor);
                  }
                }}
                onMouseLeave={(e) => {
                  if (variant === 'solid') {
                    e.currentTarget.setAttribute('fill', finalCountryFill);
                  }
                }}
              />
            );
          })}

        {activeScale > 0 && (
          <circle
            cx={cx}
            cy={cy}
            r={activeScale}
            fill="none"
            stroke={defaultSphereOutlineColor}
            strokeWidth={finalSphereOutlineWidth}
            opacity={variant === 'wireframe' ? 1.0 : 0.8}
          />
        )}
      </svg>
    </div>
  );
}

interface FormDotsProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
  darkMode?: boolean;
}

const FormDots = React.forwardRef<HTMLDivElement, FormDotsProps>(
  (
    {
      className,
      orientation = 'horizontal',
      decorative = true,
      darkMode = true,
      ...props
    },
    ref,
  ) => {
    const isHorizontal = orientation === 'horizontal';
    return (
      <div
        ref={ref}
        role={decorative ? 'none' : 'separator'}
        aria-orientation={decorative ? undefined : orientation}
        className={cn(
          'shrink-0 flex items-center justify-center overflow-hidden',
          isHorizontal ? 'w-full' : 'h-full',
          className,
        )}
        {...props}
      >
        <div
          className={cn('relative', isHorizontal ? 'w-full h-4' : 'h-full w-4')}
        >
          <div
            className={cn(
              'absolute inset-0 bg-repeat',
              darkMode ? 'text-white/20' : 'text-neutral-400',
            )}
            style={{
              backgroundImage:
                'radial-gradient(circle, currentColor 0.8px, transparent 0.8px)',
              backgroundSize: isHorizontal ? '6px 100%' : '100% 6px',
              maskImage: isHorizontal
                ? 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)'
                : 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
              WebkitMaskImage: isHorizontal
                ? 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)'
                : 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
            }}
          />
        </div>
      </div>
    );
  },
);
FormDots.displayName = 'FormDots';

export interface ContactSectionProps {
  darkMode: boolean;
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  darkMode,
  title = 'Mari Terhubung',
  subtitle = 'TERBUKA UNTUK KESEMPATAN BERKARIER',
  description = 'Saya terbuka untuk kesempatan berkarier dan bergabung dengan institusi kesehatan yang membutuhkan tenaga Rekam Medis dan Informasi Kesehatan. Silakan hubungi saya untuk informasi lebih lanjut mengenai profil, kualifikasi, dan pengalaman saya.',
  className,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormInput, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastMailtoUrl, setLastMailtoUrl] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const effectiveSubject =
      formData.subject.trim() ||
      (formData.company.trim()
        ? `Informasi Rekrutmen - ${formData.company.trim()}`
        : 'Informasi Kesempatan Karier RMIK');

    const nextErrors: Partial<Record<keyof ContactFormInput, string>> = {};
    if (!formData.name.trim()) {
      nextErrors.name = 'Nama lengkap wajib diisi.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      nextErrors.email = 'Alamat email wajib diisi.';
    } else if (!emailRegex.test(formData.email.trim())) {
      nextErrors.email = 'Masukkan format alamat email yang valid.';
    }
    if (!formData.message.trim()) {
      nextErrors.message = 'Isi pesan tidak boleh kosong.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const mailSubject = encodeURIComponent(effectiveSubject);
    const mailBody = encodeURIComponent(
      `Halo Mahesa,\n\nNama Pengirim: ${formData.name.trim()}\nInstansi / Perusahaan: ${formData.company.trim() || '-'}\nAlamat Email: ${formData.email.trim()}\n\nPesan:\n${formData.message.trim()}\n`,
    );
    const mailtoUrl = `mailto:${PROFILE_DATA.email}?subject=${mailSubject}&body=${mailBody}`;
    setLastMailtoUrl(mailtoUrl);

    try {
      await fetch(`https://formsubmit.co/ajax/${PROFILE_DATA.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          company: formData.company.trim() || '-',
          email: formData.email.trim(),
          subject: effectiveSubject,
          message: formData.message.trim(),
          _subject: `[Portofolio Mahesa] ${effectiveSubject}`,
          _template: 'table',
        }),
      });
    } catch {
      // Fallback remains available via mailto link
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        company: '',
        email: '',
        subject: '',
        message: '',
      });
    }
  };

  return (
    <section
      id="contact"
      data-sc-act="flow"
      data-sc-spotlight
      aria-labelledby="contact-heading"
      className={cn(
        'relative w-full bg-transparent overflow-hidden py-20 transition-colors duration-300',
        darkMode ? 'text-zinc-100' : 'text-zinc-900',
        className,
      )}
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30"
          >
            <span
              className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
              aria-hidden="true"
            />
            <span
              className={cn(
                'text-xs sm:text-sm font-semibold tracking-wide uppercase',
                darkMode ? 'text-emerald-400' : 'text-emerald-600',
              )}
            >
              {subtitle}
            </span>
          </motion.div>

          <motion.h2
            id="contact-heading"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: smoothEase }}
            className={cn(
              'font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
              darkMode ? 'text-white' : 'text-zinc-900',
            )}
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3, ease: smoothEase }}
            className={cn(
              'text-base sm:text-lg max-w-2xl leading-relaxed',
              darkMode ? 'text-zinc-400' : 'text-zinc-600',
            )}
          >
            {description}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-start">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.2, ease: smoothEase }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-1.5">
              <h3
                className={cn(
                  'font-display text-xl sm:text-2xl font-bold',
                  darkMode ? 'text-white' : 'text-zinc-900',
                )}
              >
                Informasi Kontak
              </h3>
              <p
                className={cn(
                  'text-sm leading-relaxed max-w-sm',
                  darkMode ? 'text-zinc-400' : 'text-zinc-500',
                )}
              >
                Apabila Anda merupakan perwakilan HRD, tim rekrutmen, atau institusi yang ingin menghubungi saya terkait kesempatan kerja, silakan gunakan informasi kontak berikut.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {CONTACT_LINKS.map(({ icon: Icon, label, href, external }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: 0.3 + i * 0.1,
                    ease: smoothEase,
                  }}
                  className={cn(
                    'group flex items-center gap-3 w-fit text-sm transition-colors duration-200',
                    darkMode
                      ? 'text-zinc-400 hover:text-white'
                      : 'text-zinc-500 hover:text-zinc-900',
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-all duration-200',
                      darkMode
                        ? 'bg-zinc-800/80 border-zinc-700 group-hover:border-rose-500/40 group-hover:bg-rose-500/10'
                        : 'bg-zinc-100 border-zinc-200 group-hover:border-rose-300 group-hover:bg-rose-50',
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-3.5 h-3.5 transition-colors duration-200',
                        darkMode
                          ? 'text-zinc-500 group-hover:text-rose-400'
                          : 'text-zinc-400 group-hover:text-rose-500',
                      )}
                    />
                  </div>
                  {label}
                </motion.a>
              ))}
            </div>

            <div className="relative overflow-hidden h-52 [mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_50%,transparent_100%)]">
              <GlobeWireframe
                className="w-full aspect-square max-w-full absolute top-0 left-0"
                variant="wireframesolid"
                autoRotate
                autoRotateSpeed={0.45}
                strokeWidth={0.6}
                graticuleOpacity={0.12}
              />
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.35, ease: smoothEase }}
            className={cn(
              'rounded-2xl border p-6 sm:p-8 flex flex-col gap-5 backdrop-blur-md',
              darkMode
                ? 'border-zinc-800 bg-zinc-900/85'
                : 'border-zinc-200 bg-white/90',
            )}
          >
            <div>
              <h3
                className={cn(
                  'font-display text-xl font-bold mb-1',
                  darkMode ? 'text-white' : 'text-zinc-900',
                )}
              >
                Kirim Pesan
              </h3>
              <p
                className={cn(
                  'text-sm leading-relaxed',
                  darkMode ? 'text-zinc-400' : 'text-zinc-500',
                )}
              >
                Gunakan formulir berikut untuk menyampaikan informasi mengenai lowongan pekerjaan, proses rekrutmen, atau komunikasi profesional lainnya. Saya akan berusaha merespons pesan yang masuk secepat mungkin.
              </p>
            </div>

            <FormDots darkMode={darkMode} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-name"
                  className={cn(
                    'text-xs font-semibold tracking-widest uppercase',
                    darkMode ? 'text-zinc-500' : 'text-zinc-400',
                  )}
                >
                  Nama Lengkap
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Masukkan nama lengkap Anda"
                  className={cn(
                    'w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-500/10 transition-all duration-200',
                    darkMode
                      ? 'bg-zinc-800/60 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus:border-rose-500/50'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-800 placeholder:text-zinc-400 focus:border-rose-400',
                  )}
                />
                {errors.name && (
                  <p role="alert" className="text-xs text-rose-400 font-medium">
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-company"
                  className={cn(
                    'text-xs font-semibold tracking-widest uppercase',
                    darkMode ? 'text-zinc-500' : 'text-zinc-400',
                  )}
                >
                  Instansi / Perusahaan
                </label>
                <input
                  id="contact-company"
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                  placeholder="Nama rumah sakit, klinik, atau perusahaan"
                  className={cn(
                    'w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-500/10 transition-all duration-200',
                    darkMode
                      ? 'bg-zinc-800/60 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus:border-rose-500/50'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-800 placeholder:text-zinc-400 focus:border-rose-400',
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-email"
                  className={cn(
                    'text-xs font-semibold tracking-widest uppercase',
                    darkMode ? 'text-zinc-500' : 'text-zinc-400',
                  )}
                >
                  Alamat Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="email@institusi.com"
                  className={cn(
                    'w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-500/10 transition-all duration-200',
                    darkMode
                      ? 'bg-zinc-800/60 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus:border-rose-500/50'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-800 placeholder:text-zinc-400 focus:border-rose-400',
                  )}
                />
                {errors.email && (
                  <p role="alert" className="text-xs text-rose-400 font-medium">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-subject"
                  className={cn(
                    'text-xs font-semibold tracking-widest uppercase',
                    darkMode ? 'text-zinc-500' : 'text-zinc-400',
                  )}
                >
                  Subjek Pesan
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  placeholder="Contoh: Informasi Lowongan Staf Rekam Medis"
                  className={cn(
                    'w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-500/10 transition-all duration-200',
                    darkMode
                      ? 'bg-zinc-800/60 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus:border-rose-500/50'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-800 placeholder:text-zinc-400 focus:border-rose-400',
                  )}
                />
                {errors.subject && (
                  <p role="alert" className="text-xs text-rose-400 font-medium">
                    {errors.subject}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="contact-message"
                className={cn(
                  'text-xs font-semibold tracking-widest uppercase',
                  darkMode ? 'text-zinc-500' : 'text-zinc-400',
                )}
              >
                Pesan
              </label>
              <textarea
                id="contact-message"
                placeholder="Tuliskan pesan atau informasi yang ingin disampaikan..."
                rows={4}
                value={formData.message}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, message: e.target.value }))
                }
                className={cn(
                  'w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-rose-500/10 resize-none transition-all duration-200',
                  darkMode
                    ? 'bg-zinc-800/60 border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus:border-rose-500/50'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-800 placeholder:text-zinc-400 focus:border-rose-400',
                )}
              />
              {errors.message && (
                <p role="alert" className="text-xs text-rose-400 font-medium">
                  {errors.message}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'w-fit h-11 px-8 rounded-xl font-semibold text-sm inline-flex items-center gap-2 transition-colors duration-200 cursor-pointer group disabled:opacity-60 disabled:cursor-not-allowed',
                  darkMode
                    ? 'bg-white hover:bg-zinc-100 text-zinc-900'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white',
                )}
              >
                <span>{isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              {submitted && (
                <div
                  role="status"
                  className="inline-flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-emerald-500 dark:text-emerald-400"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="w-4 h-4 shrink-0" />
                    Pesan berhasil disubmit!
                  </span>
                  {lastMailtoUrl && (
                    <a
                      href={lastMailtoUrl}
                      className="underline underline-offset-4 opacity-85 hover:opacity-100"
                    >
                      (Buka juga di Aplikasi Email)
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
