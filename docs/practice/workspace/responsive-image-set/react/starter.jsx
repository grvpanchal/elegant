const WIDTHS = [400, 800, 1200, 2400];

/**
 * Image.
 * Emit srcset over WIDTHS, pass `sizes` through, reserve the box from
 * width/height, lazy-load unless `priority`, and require `alt`.
 */
export default function Image({ src, alt, width, height, sizes = "100vw", priority = false }) {
  // Your code here.
  return <img src={src} alt={alt} width={width} height={height} />;
}
