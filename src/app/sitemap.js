// app/sitemap.js

export default function sitemap() {
  const baseUrl = "https://cherrylconcept.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
    },
  ];
}
