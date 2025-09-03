export function getAllFeatures(featureJson: any) {
  const features = featureJson?.features || {};
  const freeFeature = featureJson?.plans?.free || {};
  const proFeature = featureJson?.plans?.pro || {};
  const roleFeature = featureJson?.roles?.["admin"] || {};
  const allFeatures = {
    ...features,
    ...freeFeature,
    ...proFeature,
    ...roleFeature,
  };

  const flags: any = {};
  Object.keys(allFeatures).forEach((key) => {
    flags[key] = {
      disabled: false,
      variants: {
        default: allFeatures[key],
      },
      defaultVariant: "default",
    };
  });
  return flags;
}
