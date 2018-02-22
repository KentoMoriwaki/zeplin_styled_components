const DEBUG = false;

function layer(context, layer) {
  try {
    const style =
      layer.textStyles.length === 0 ? null : layer.textStyles[0].textStyle;

    const styles = [
      width(layer),
      height(layer),
      fontFamily(style),
      fontSize(style),
      // fontWeight(style),
      fontStyle(style),
      // fontStretch(style),
      lineHeight(style),
      textAlign(style),
      color(style),
      border(layer),
      borderRadius(layer),
      boxShadow(layer),
      opacity(layer),
      backgroundColor(layer)
    ]
      .reduce(function(acc, styles) {
        return acc.concat(styles);
      }, [])
      .filter(Boolean);

    let language = "javascript";
    let code = `
const Component = styled.div\`
  ${styles.join("\n  ")}
\`;
`;

    if (DEBUG) {
      language = "json";
      code = JSON.stringify({ context, layer });
    }

    return {
      code,
      language
    };
  } catch (e) {
    return {
      code: e.message,
      language: "text"
    };
  }
}

function width(layer) {
  const width = layer.rect.width;
  return `width: ${Math.round(width)}px;`;
}

function height(layer) {
  const height = layer.rect.height;
  return `height: ${Math.round(height)}px;`;
}

function fontFamily(style) {
  if (style == null) return "";
  let family = style.fontFamily;
  let weight = null;
  const matched = family.match(/HiraginoSans-W(\d)/);
  if (matched) {
    family = null;
    weight = parseInt(matched[1], 10) * 100;
  }
  return [
    family && `font-family: ${family};`,
    weight && `font-weight ${weight};`
  ];
}

function fontSize(style) {
  if (style == null) return "";
  return `font-size: ${style.fontSize}px;`;
}

function fontWeight(style) {
  if (style == null) return "";
  return `font-weight: ${style.fontWeight};`;
}

function fontStyle(style) {
  if (style == null) return "";
  return style.fontStyle === "normal" ? "" : `font-style: ${style.fontStyle};`;
}

function fontStretch(style) {
  if (style == null) return "";
  return style.fontStretch === "normal"
    ? ""
    : `font-stretch:    ${style.fontStretch};`;
}

function lineHeight(style) {
  if (style == null) return "";
  const height = style.lineHeight / style.fontSize;
  return `line-height: ${Math.round(height * 100) / 100};`;
}

function textAlign(style) {
  if (style == null) return "";
  return style.textAlign === "left" ? "" : `text-align: ${style.textAlign};`;
}

function color(style) {
  if (style == null) return "";
  return `color: rgba(${style.color.r}, ${style.color.g}, ${style.color.b}, ${
    style.color.a
  });`;
}

function opacity(layer) {
  return layer.opacity === 1 ? "" : `opacity: ${layer.opacity};`;
}

function border(layer) {
  return layer.borders.length === 0
    ? ""
    : `border: solid ${Math.round(layer.borders[0].thickness)}px rgba(${
        layer.borders[0].fill.color.r
      }, ${layer.borders[0].fill.color.g}, ${layer.borders[0].fill.color.b}, ${
        layer.borders[0].fill.color.a
      });`;
}

function borderRadius(layer) {
  return layer.borderRadius === 0
    ? ""
    : `border-radius: ${layer.borderRadius};`;
}

function boxShadow(layer) {
  return layer.shadows.length === 0
    ? ""
    : `box-shadow: ${Math.round(layer.shadows[0].offsetX)}px ${Math.round(
        layer.shadows[0].offsetY
      )}px ${Math.round(layer.shadows[0].blurRadius)}px ${Math.round(
        layer.shadows[0].spread
      )}px rgba(${layer.shadows[0].color.r}, ${layer.shadows[0].color.g}, ${
        layer.shadows[0].color.b
      }, ${layer.shadows[0].color.a});`;
}

function backgroundColor(layer) {
  return layer.fills.length === 0
    ? ""
    : `background-color: rgba(${layer.fills[0].color.r}, ${
        layer.fills[0].color.g
      }, ${layer.fills[0].color.b}, ${layer.fills[0].color.a})`;
}
