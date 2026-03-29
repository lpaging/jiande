export const siteData = {
  hero: {
    title: "薄胎瓷",
    subtitle: "JianDe Works",
    description:
      "20cm玛瑙红山水纹薄胎碗。器形先于叙述，光线先于装饰。",
    images: [
      {
        src: "/images/hero-1.JPG",
        alt: "Porcelain bowl, first viewing angle"
      },
      {
        src: "/images/hero-2.JPG",
        alt: "Porcelain bowl, second viewing angle"
      },
      {
        src: "/images/hero-3.JPG",
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
        src: "/images/form-left.JPG",
        alt: "Profile of a thin porcelain bowl"
      },
      {
        src: "/images/form-right.JPG",
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
        src: "/images/light-main.JPG",
        alt: "Backlit translucent porcelain bowl"
      },
      details: [
        {
          src: "/images/light-rim.jpg",
          alt: "Close-up of a porcelain rim under soft light"
        },
        {
          src: "/images/light-detail.jpg",
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
        src: "/images/variation-1.jpg",
        alt: "Porcelain bowl with sparse brush markings"
      },
      {
        src: "/images/variation-2.jpg",
        alt: "Porcelain bowl with warm tonal surface"
      },
      {
        src: "/images/variation-3.jpg",
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
      src: "/images/author-hand.jpg",
      alt: "Hands shaping porcelain in the studio"
    }
  },
  entry: {
    label: "View Works",
    hint: "后续可以把这里接到作品列表或单独的 works 路由；当前保留为首页叙事的出口。"
  }
} as const;
