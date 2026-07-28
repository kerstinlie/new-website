export type NavNode = {
  title: string;
  slug: string | null;
  href?: string | null;
  children?: NavNode[];
};

export type LangNav = {
  main: NavNode[];
  top: NavNode[];
  quickLinks: NavNode[];
  bottom: NavNode[];
};

export const navigation: Record<'en' | 'de', LangNav> = {
  "en": {
    "main": [
      {
        "title": "THE SOLUTION",
        "slug": null,
        "href": null,
        "children": [
          {
            "title": "The Suite (Overview)",
            "slug": "digital-publishing-software-suite",
            "href": null,
            "children": [
              {
                "title": "Automation",
                "slug": null,
                "href": null,
                "children": [
                  {
                    "title": "Automation Tools (full automation)",
                    "slug": "product-automation-tools",
                    "href": null
                  },
                  {
                    "title": "Publication Wizard (partial automation)",
                    "slug": "product-publication-wizard",
                    "href": null
                  },
                  {
                    "title": "InDesign Plugin (partial automation)",
                    "slug": "product-indesign-plugin",
                    "href": null
                  },
                  {
                    "title": "Datasheet Automation App",
                    "slug": "datasheet-automation-app",
                    "href": null
                  }
                ]
              },
              {
                "title": "Publication Management",
                "slug": null,
                "href": null,
                "children": [
                  {
                    "title": "Planner",
                    "slug": "product-planner",
                    "href": null
                  },
                  {
                    "title": "Publisher",
                    "slug": "product-publisher",
                    "href": null
                  },
                  {
                    "title": "Project Editor",
                    "slug": "product-project-editor",
                    "href": null
                  }
                ]
              }
            ]
          },
          {
            "title": "Releases",
            "slug": null,
            "href": null,
            "children": [
              {
                "title": "InBetween 6",
                "slug": "inbetween-6",
                "href": null
              },
              {
                "title": "InBetween 5",
                "slug": "inbetween-5-best-product-experience",
                "href": null
              }
            ]
          },
          {
            "title": "Use Cases",
            "slug": "publishing-use-cases-en",
            "href": null
          }
        ]
      },
      {
        "title": "SERVICE",
        "slug": "services-en",
        "href": null
      },
      {
        "title": "INBETWEEN FOR",
        "slug": null,
        "href": null,
        "children": [
          {
            "title": "InBetween for you",
            "slug": "print-publishing-for-you-en",
            "href": null
          },
          {
            "title": "Partnerships",
            "slug": "partner-program",
            "href": null
          }
        ]
      },
      {
        "title": "ABOUT US",
        "slug": null,
        "href": null,
        "children": [
          {
            "title": "About us",
            "slug": "about-inbetween-database-publishing",
            "href": null
          },
          {
            "title": "News",
            "slug": "news",
            "href": null
          },
          {
            "title": "Jobs",
            "slug": "jobs-en",
            "href": null
          },
          {
            "title": "Our Customers",
            "slug": "customers-en",
            "href": null
          },
          {
            "title": "Partners Overview",
            "slug": "partners-en",
            "href": null,
            "children": [
              {
                "title": "Software Partners",
                "slug": "partners-software-en",
                "href": null
              },
              {
                "title": "Tech Partners",
                "slug": "partners-technology-en",
                "href": null
              },
              {
                "title": "Business Partners",
                "slug": "partners-business-en",
                "href": null
              }
            ]
          },
          {
            "title": "ESG &amp; Sustainability",
            "slug": "esg",
            "href": null
          }
        ]
      },
      {
        "title": "RESOURCES",
        "slug": null,
        "href": null,
        "children": [
          {
            "title": "Success Stories",
            "slug": "success-stories",
            "href": null
          },
          {
            "title": "Knowledge Base",
            "slug": null,
            "href": null,
            "children": [
              {
                "title": "Data-Driven Publishing",
                "slug": "data-driven-publishing",
                "href": null
              },
              {
                "title": "TDS – Tecnical Datasheets",
                "slug": "knowledge-technical-datasheets",
                "href": null
              },
              {
                "title": "Linking PIM and Print Automation Software in 3 Steps",
                "slug": "linking-pim-and-print-automation-software",
                "href": null
              },
              {
                "title": "InBetween Quick Info",
                "slug": "database-publishing-software",
                "href": null
              }
            ]
          },
          {
            "title": "Use Cases",
            "slug": "publishing-use-cases-en",
            "href": null
          },
          {
            "title": "Webinars",
            "slug": "webinars",
            "href": null
          }
        ]
      }
    ],
    "top": [
      {
        "title": "News",
        "slug": "news",
        "href": null
      },
      {
        "title": "Careers",
        "slug": "jobs-en",
        "href": null
      },
      {
        "title": "Contact",
        "slug": null,
        "href": "#contact"
      },
      {
        "title": "Imprint",
        "slug": "legal-notice-en",
        "href": null
      },
      {
        "title": "Privacy Policy",
        "slug": "privacy-policy-en",
        "href": null
      }
    ],
    "quickLinks": [
      {
        "title": "InBetween - The Suite",
        "slug": "digital-publishing-software-suite",
        "href": null
      },
      {
        "title": "News",
        "slug": "news",
        "href": null
      },
      {
        "title": "Success Stories",
        "slug": "success-stories",
        "href": null
      },
      {
        "title": "Data-Driven Publishing",
        "slug": "data-driven-publishing",
        "href": null
      },
      {
        "title": "Use Cases",
        "slug": "publishing-use-cases-en",
        "href": null
      },
      {
        "title": "Partners Overview",
        "slug": "partners-en",
        "href": null
      }
    ],
    "bottom": [
      {
        "title": "Imprint",
        "slug": "legal-notice-en",
        "href": null
      },
      {
        "title": "Privacy Policy",
        "slug": "privacy-policy-en",
        "href": null
      }
    ]
  },
  "de": {
    "main": [
      {
        "title": "DIE LÖSUNG",
        "slug": null,
        "href": null,
        "children": [
          {
            "title": "InBetween – Die Lösung",
            "slug": "database-publishing-print-automation",
            "href": null
          },
          {
            "title": "Die Module",
            "slug": null,
            "href": null,
            "children": [
              {
                "title": "Planner",
                "slug": "publikationen-planen-im-team",
                "href": null
              },
              {
                "title": "Publication Wizard",
                "slug": "produkt-publication-wizard",
                "href": null
              },
              {
                "title": "Publisher",
                "slug": "publisher-de",
                "href": null
              },
              {
                "title": "InDesign Plugin",
                "slug": "dtp-client-de",
                "href": null
              },
              {
                "title": "Auto Generator Cloud",
                "slug": "cloud-basierte-software",
                "href": null
              },
              {
                "title": "InBetween Server",
                "slug": "produkt-inbetween-server-de",
                "href": null
              }
            ]
          },
          {
            "title": "InBetween 6",
            "slug": "inbetween-6-release",
            "href": null
          },
          {
            "title": "InBetween 5",
            "slug": "inbetween-software-release-5-de",
            "href": null
          },
          {
            "title": "Anwendungsfälle",
            "slug": "anwendungsfalle-inbetween-software",
            "href": null
          }
        ]
      },
      {
        "title": "SERVICE",
        "slug": "service-de",
        "href": null
      },
      {
        "title": "INBETWEEN FÜR",
        "slug": null,
        "href": null,
        "children": [
          {
            "title": "InBetween für Interessenten",
            "slug": "print-publishing-fuer-interessenten-de",
            "href": null
          },
          {
            "title": "Partnerschaften",
            "slug": "partner-programm",
            "href": null
          }
        ]
      },
      {
        "title": "ÜBER UNS",
        "slug": null,
        "href": null,
        "children": [
          {
            "title": "Über uns",
            "slug": "ueber-uns-de",
            "href": null
          },
          {
            "title": "News",
            "slug": "neues",
            "href": null
          },
          {
            "title": "Offene Stellen",
            "slug": "offene-stellen-de",
            "href": null
          },
          {
            "title": "Unsere Kunden",
            "slug": "kunden-de",
            "href": null
          },
          {
            "title": "Unsere Partner",
            "slug": "partner-de",
            "href": null,
            "children": [
              {
                "title": "Partner – Software Partner",
                "slug": "partner-software-de",
                "href": null
              },
              {
                "title": "Partner – Tech Partner",
                "slug": "partner-tech-de",
                "href": null
              },
              {
                "title": "Partner – Business Partner",
                "slug": "partner-business-de",
                "href": null
              }
            ]
          }
        ]
      },
      {
        "title": "RESSOURCEN",
        "slug": null,
        "href": null,
        "children": [
          {
            "title": "Erfolgsgeschichten",
            "slug": "erfolgsgeschichten",
            "href": null
          },
          {
            "title": "Anwendungsfälle",
            "slug": "anwendungsfalle-inbetween-software",
            "href": null
          },
          {
            "title": "Wissen",
            "slug": null,
            "href": null,
            "children": [
              {
                "title": "Data-Driven Publishing",
                "slug": "data-driven-publishing-software",
                "href": null
              },
              {
                "title": "TDS – Technische Datenblätter",
                "slug": "tds-technische-datenblatter",
                "href": null
              },
              {
                "title": "PIM und Print Automatisierung in 3 Schritten erklärt!",
                "slug": "pim-und-print-automatisierung-in-3-schritten",
                "href": null
              },
              {
                "title": "InBetween Quick Info",
                "slug": "publishing-software-inbetween",
                "href": null
              }
            ]
          },
          {
            "title": "Webinare",
            "slug": "webinare",
            "href": null
          }
        ]
      }
    ],
    "top": [
      {
        "title": "News",
        "slug": "neues",
        "href": null
      },
      {
        "title": "Karriere",
        "slug": "offene-stellen-de",
        "href": null
      },
      {
        "title": "Kontakt",
        "slug": null,
        "href": "#contact"
      },
      {
        "title": "Datenschutz",
        "slug": "datenschutzerklaerung-de",
        "href": null
      },
      {
        "title": "Impressum",
        "slug": "impressum-de",
        "href": null
      }
    ],
    "quickLinks": [
      {
        "title": "News",
        "slug": "neues",
        "href": null
      },
      {
        "title": "InBetween Quick Info",
        "slug": "publishing-software-inbetween",
        "href": null
      },
      {
        "title": "Erfolgsgeschichten",
        "slug": "erfolgsgeschichten",
        "href": null
      },
      {
        "title": "InBetween – Die Lösung",
        "slug": "database-publishing-print-automation",
        "href": null
      },
      {
        "title": "Anwendungsfälle",
        "slug": "anwendungsfalle-inbetween-software",
        "href": null
      },
      {
        "title": "Partner",
        "slug": "partner-de",
        "href": null
      }
    ],
    "bottom": [
      {
        "title": "Impressum",
        "slug": "impressum-de",
        "href": null
      },
      {
        "title": "Datenschutz",
        "slug": "datenschutzerklaerung-de",
        "href": null
      }
    ]
  }
};
