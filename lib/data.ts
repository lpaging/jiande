export const siteData = {
  hero: {
    title: "薄胎瓷",
    subtitle: "JianDe Works",
    description:
      "20cm玛瑙红山水纹薄胎碗。\n器形先于叙述，光线先于装饰。",
    images: [
      {
        src: "/images/hero-1.webp",
        alt: "Porcelain bowl, first viewing angle"
      },
      {
        src: "/images/hero-2.webp",
        alt: "Porcelain bowl, second viewing angle"
      },
      {
        src: "/images/hero-3.webp",
        alt: "Porcelain bowl, third viewing angle"
      }
    ]
  },
  form: {
    title: "Form defines the work.",
    statement: "器形构成作品的核心。",
    body:
      "从口沿、腹部到足部，比例关系决定一件器物是否成立。按统一标准修改图片，以达到最佳展示效果。",
    images: [
      {
        src: "/images/form-left.webp",
        alt: "Profile of a thin porcelain bowl"
      },
      {
        src: "/images/form-right.webp",
        alt: "Front-facing porcelain vessel showing quiet symmetry"
      }
    ]
  },
  light: {
    title: "The work exists between form and light.",
    statement: "薄胎不是更薄的胎体，而是让光参与器物的一种方法。",
    body:
      "透光、边缘厚薄、釉面反射与内壁阴影共同定义观看效果。让材质自己发声。让材质自己发声。让材质自己发声。",
    images: {
      main: {
        src: "/images/light-main.webp",
        alt: "Backlit translucent porcelain bowl"
      },
      details: [
        {
          src: "/images/light-rim.webp",
          alt: "Close-up of a porcelain rim under soft light"
        },
        {
          src: "/images/light-detail.webp",
          alt: "Porcelain detail with luminous surface"
        }
      ]
    }
  },
  variation: {
    statement: "Form varies. Surface remains.",
    body:
      "薄胎瓷、镶器、双面瓷板釉。绘画与表层处理是开放的，它们可以协作、留白，但不能取代器物本体的多样性。图片需要进一步统一处理。",
    images: [
      {
        src: "/images/variation-1.webp",
        alt: "Porcelain bowl with sparse brush markings"
      },
      {
        src: "/images/variation-2.webp",
        alt: "Porcelain bowl with warm tonal surface"
      },
      {
        src: "/images/variation-3.webp",
        alt: "Porcelain bowl with restrained line work"
      }
    ]
  },
  author: {
    title: "Lu Jiande",
    body: [
      "实践围绕薄胎技艺展开，关注材料控制、器形精度与窑火变化的最终呈现。",
      "图片选取展示手部、工序与工作状态。"
    ],
    image: {
      src: "/images/author-hand.webp",
      alt: "Hands shaping porcelain in the studio"
    }
  },
  entry: {
    label: "View Works",
    hint: "后续可以把这里接到作品列表或单独的 works 路由；当前保留为首页叙事的出口。"
  },
  works: {
    intro:
      "作品不是目录，而是一片缓慢展开的观看现场。图像先于说明，信息退后，只留下器形、光感与表面的轻微差异。",
    items: [
      {
        title: "薄胎碗 I",
        meta: "2024 · Egg-shell porcelain · 20 cm",
        image: {
          src: "/images/hero-1.webp",
          alt: "Thin porcelain bowl, front angle"
        },
        ratio: "5639 / 3778"
      },
      {
        title: "光感研究",
        meta: "2024 · Light study · Detail",
        image: {
          src: "/images/light-main.webp",
          alt: "Backlit porcelain surface"
        },
        ratio: "5616 / 3744"
      },
      {
        title: "口沿变化",
        meta: "2023 · Rim study · Detail",
        image: {
          src: "/images/light-rim.webp",
          alt: "Porcelain rim detail"
        },
        ratio: "717 / 421"
      },
      {
        title: "表面笔记",
        meta: "2024 · Brushwork · Surface",
        image: {
          src: "/images/variation-1.webp",
          alt: "Porcelain with painted surface"
        },
        ratio: "5616 / 3744"
      },
      {
        title: "白瓷器形",
        meta: "2022 · Vessel study",
        image: {
          src: "/images/form-right.webp",
          alt: "White porcelain vessel"
        },
        ratio: "5616 / 3744"
      },
      {
        title: "材质边界",
        meta: "2023 · Material edge · Detail",
        image: {
          src: "/images/light-detail.webp",
          alt: "Porcelain material detail"
        },
        ratio: "588 / 400"
      },
      {
        title: "山水薄胎碗",
        meta: "2024 · Landscape motif",
        image: {
          src: "/images/hero-2.webp",
          alt: "Painted porcelain bowl"
        },
        ratio: "5616 / 3744"
      },
      {
        title: "档案视图",
        meta: "2024 · Archive view · Studio",
        image: {
          src: "/images/form-left.webp",
          alt: "Porcelain form in profile"
        },
        ratio: "5616 / 3744"
      }
    ]
  },
  collections: {
    intro:
      "收藏页面更接近档案，而不是陈列。它记录作品被保存、捐赠与流通的轨迹，让观看从器物延伸到它所进入的语境。",
    sections: [
      {
        title: "Public Collections",
        items: [
          {
            period: "2025",
            title: "市立美术馆收藏（占位）",
            detail: "薄胎碗系列之一进入馆藏，用于近现代陶瓷研究与长期展示。"
          },
          {
            period: "2024",
            title: "地方陶瓷档案库（占位）",
            detail: "器形研究作品被纳入当代瓷艺研究项目的档案序列。"
          }
        ]
      },
      {
        title: "Donations",
        items: [
          {
            period: "2023",
            title: "工作室捐赠（占位）",
            detail: "一组示范性作品捐赠用于公共教育与上手研究。"
          },
          {
            period: "2022",
            title: "文化交流赠藏（占位）",
            detail: "代表性薄胎碗通过交流项目进入相关机构留存。"
          }
        ]
      },
      {
        title: "Auction Records",
        items: [
          {
            period: "2025",
            title: "秋季拍卖记录（占位）",
            detail: "玛瑙红山水纹薄胎碗进入拍卖图录，估价与成交信息存档备查。"
          },
          {
            period: "2024",
            title: "春季夜场记录（占位）",
            detail: "绘画薄胎器进入私人拍卖目录，作为流通记录保留。"
          }
        ]
      }
    ]
  },
  news: {
    intro:
      "新闻保持简洁，只记录展览、出版与工作动态，不做资讯站式铺陈。",
    items: [
      {
        date: "2026.03",
        kind: "Exhibition",
        title: "展览预告（占位）",
        body: "新一组薄胎瓷作品将于当代工艺空间呈现，重点围绕器形、透光与表层节制展开。"
      },
      {
        date: "2025.11",
        kind: "Publication",
        title: "图录文章（占位）",
        body: "一篇简短文章与图像序列将记录近期器物研究及其与轮廓、光线之间的关系。"
      },
      {
        date: "2025.06",
        kind: "Notice",
        title: "工作室预约开放（占位）",
        body: "工作室将开放限量预约参观，面向策展人、研究者与受邀访客。"
      },
      {
        date: "2024.12",
        kind: "Collection",
        title: "馆藏收录（占位）",
        body: "近期系列中的一件代表性薄胎碗已进入机构收藏，后续将补充更完整的档案记录。"
      }
    ]
  },
  about: {
    intro:
      "About 并不强调人物肖像，而是提供方法、经历与工作脉络。重点仍然放在实践本身，而不是自我展示。",
    biography: [
      "陆建德长期围绕薄胎瓷展开创作，关注以碗为中心的器形语言，以及胎体厚薄、边缘控制与透光效果之间的关系。",
      "在他的实践中，表面图像从不先于结构。绘画、书写与色层变化更像器物完成之后的回响，而不是作品成立的起点。",
      "工作方式缓慢而克制，强调材料精度、手部经验与烧成后的细微变化，也关心器物被手持、被观看时所产生的尺度感。"
    ],
    cvGroups: [
      {
        title: "Selected Exhibitions",
        items: [
          {
            year: "2026",
            text: "当代陶艺邀请展（占位）"
          },
          {
            year: "2025",
            text: "薄胎瓷作品个展（占位）"
          },
          {
            year: "2024",
            text: "当代器物实践主题展（占位）"
          }
        ]
      },
      {
        title: "Selected Collections",
        items: [
          {
            year: "2025",
            text: "市立美术馆收藏（占位）"
          },
          {
            year: "2024",
            text: "地方陶瓷档案收藏（占位）"
          }
        ]
      },
      {
        title: "Selected Publications",
        items: [
          {
            year: "2025",
            text: "图录文章与图像记录（占位）"
          },
          {
            year: "2023",
            text: "陶艺期刊专题（占位）"
          }
        ]
      }
    ],
    contact: {
      studio: "工作室访问需提前预约。",
      email: "contact@lujiande.com",
      instagram: "Instagram / Archive link（占位）"
    }
  }
} as const;
