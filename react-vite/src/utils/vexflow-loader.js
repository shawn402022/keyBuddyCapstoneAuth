let vexflowInstance = null;

export const loadVexflow = async () => {
  if (!vexflowInstance) {
    // Only load once and cache the instance
    vexflowInstance = (await import('vexflow')).default;
  }
  return vexflowInstance;
};
