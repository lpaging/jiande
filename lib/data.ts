export const siteData = {
  hero: {
    title: "薄胎瓷",
    subtitle: "JianDe Ceramic Works",
    description:
      "器形先于叙述，光线先于装饰。页面的任务不是解释作品，而是让观看慢下来。",
    image: "/images/hero.JPG"
  },
  form: {
    title: "Form defines the work.",
    statement: "器形构成作品的核心。",
    body:
      "从口沿、腹部到足部，比例关系决定一件器物是否成立。表面可以变化，结构与重量感不能动摇。",
    images: [
      {
        src: "/images/form-left.svg",
        alt: "Profile of a thin porcelain bowl"
      },
      {
        src: "/images/form-right.svg",
        alt: "Front-facing porcelain vessel showing quiet symmetry"
      }
    ]
  },
  light: {
    title: "The work exists between form and light.",
    statement: "薄胎不是更薄的表面，而是让光参与器物的一种方法。",
    body:
      "透光、边缘厚薄、釉面反射与内壁阴影共同定义观看经验。这里的亮度变化必须轻微，只让材质自己发声。",
    images: {
      main: {
        src: "/images/light-main.svg",
        alt: "Backlit translucent porcelain bowl"
      },
      details: [
        {
          src: "/images/light-rim.svg",
          alt: "Close-up of a porcelain rim under soft light"
        },
        {
          src: "/images/light-detail.svg",
          alt: "Porcelain detail with luminous surface"
        }
      ]
    }
  },
  variation: {
    statement: "Surface varies. Form remains.",
    body:
      "绘画与表层处理是开放的，它们可以协作、偏移、留白，但不能取代器物本体。",
    images: [
      {
        src: "/images/variation-1.svg",
        alt: "Porcelain bowl with sparse brush markings"
      },
      {
        src: "/images/variation-2.svg",
        alt: "Porcelain bowl with warm tonal surface"
      },
      {
        src: "/images/variation-3.svg",
        alt: "Porcelain bowl with restrained line work"
      }
    ]
  },
  author: {
    title: "Lu Jiande",
    body: [
      "实践围绕薄胎瓷展开，关注材料控制、器形精度与透光后的边界。",
      "图像优先展示手部、工序与工作状态，而不是正面肖像。作者只作为方法的承载者出现。"
    ],
    image: {
      src: "/images/author-hand.jpg",
      alt: "Hands shaping porcelain in the studio"
    }
  },
  entry: {
    label: "View Works",
    hint: "后续可以把这里接到作品列表或单独的 works 路由；当前保留为首页叙事的出口。"
  }
} as const;
