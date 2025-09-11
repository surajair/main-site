
export const generateScriptId = (script: string, index: number): string => {
  const trimmedScript = script.trim();
  
  // Check for common tracking services and generate meaningful IDs
  if (trimmedScript.includes('gtag') || trimmedScript.includes('googletagmanager')) {
    return 'google-analytics-custom';
  }
  if (trimmedScript.includes('fbq') || trimmedScript.includes('facebook.net')) {
    return 'facebook-pixel-custom';
  }
  if (trimmedScript.includes('clarity.ms') || trimmedScript.includes('clarity')) {
    return 'clarity-custom';
  }
  if (trimmedScript.includes('hotjar') || trimmedScript.includes('hj.js')) {
    return 'hotjar-script';
  }
  if (trimmedScript.includes('intercom') || trimmedScript.includes('widget.intercom')) {
    return 'intercom-script';
  }
  if (trimmedScript.includes('mixpanel') || trimmedScript.includes('mixpanel.com')) {
    return 'mixpanel-script';
  }
  if (trimmedScript.includes('amplitude') || trimmedScript.includes('amplitude.com')) {
    return 'amplitude-script';
  }
  if (trimmedScript.includes('segment') || trimmedScript.includes('segment.com')) {
    return 'segment-script';
  }
  
  // For URL scripts, extract domain name
  const urlMatch = trimmedScript.match(/https?:\/\/(?:www\.)?([^\/]+)/);
  if (urlMatch) {
    const domain = urlMatch[1].replace(/\./g, '-');
    return `external-${domain}`;
  }
  
  // Fallback to generic ID with index
  return `custom-script-${index}`;
};