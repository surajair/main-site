import * as cheerio from "cheerio";
import Script from "next/script";

interface MetaAttributes {
  [key: string]: string;
  key: string;
}

interface ScriptElement {
  src: string;
  content: string;
  attributes: { [key: string]: string };
  key: string;
}

interface LinkAttributes {
  [key: string]: string;
  key: string;
}

interface StyleElement {
  content: string;
}

interface HeadElements {
  title?: string;
  metas: MetaAttributes[];
  scripts: ScriptElement[];
  links: LinkAttributes[];
  styles: StyleElement[];
}

function parseHeadElements(htmlString: string): HeadElements {
  // Parse HTML using Cheerio (server-side)
  const $ = cheerio.load(htmlString);

  const headElements: HeadElements = {
    metas: [],
    scripts: [],
    links: [],
    styles: [],
  };

  // Extract meta tags
  $("meta").each((index, element) => {
    const attributes: { [key: string]: string } = {};
    const attribs = $(element).attr();
    if (attribs) {
      Object.keys(attribs).forEach((key) => {
        attributes[key] = attribs[key];
      });
    }
    headElements.metas.push({ ...attributes, key: `meta-${index}` });
  });

  // Extract script tags
  $("script").each((index, element) => {
    const $script = $(element);
    const src = $script.attr("src") || "";
    const content = $script.html() || "";
    const attribs = $script.attr();
    const attributes: { [key: string]: string } = {};

    if (attribs) {
      Object.keys(attribs).forEach((key) => {
        if (key !== "src") {
          attributes[key] = attribs[key];
        }
      });
    }

    headElements.scripts.push({
      src,
      content,
      attributes,
      key: `script-${index}`,
    });
  });

  // Extract link tags
  $("link").each((index, element) => {
    const attributes: { [key: string]: string } = {};
    const attribs = $(element).attr();
    if (attribs) {
      Object.keys(attribs).forEach((key) => {
        attributes[key] = attribs[key];
      });
    }
    headElements.links.push({ ...attributes, key: `link-${index}` });
  });

  return headElements;
}

export async function ChaiCustomHtml({ htmlHeadString }: { htmlHeadString: string }) {
  const headElements = parseHeadElements(htmlHeadString);
  return (
    <>
      {headElements.metas.map((meta) => (
        <meta {...meta} key={meta.key} />
      ))}
      {headElements.links.map((link) => (
        <link {...link} key={link.key} />
      ))}
      {headElements.styles.map((style, index) => (
        <style key={`style-${index}`} dangerouslySetInnerHTML={{ __html: style.content }} />
      ))}
      {headElements.scripts.map((script) =>
        script.src ? (
          <Script key={script.key} src={script.src} {...script.attributes} />
        ) : (
          <Script key={script.key} dangerouslySetInnerHTML={{ __html: script.content }} {...script.attributes} />
        ),
      )}
    </>
  );
}
