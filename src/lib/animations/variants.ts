import { Variants } from "framer-motion";

export const containerVariants: Variants = {
  closed: { 
    gap: '0px',
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  },
  open: { 
    gap: '40px',
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  }
};

export const cardVariants: Variants = {
  left: { 
    rotateY: 8,
    x: '-20%',
    opacity: 0.7,
    scale: 0.9,
    zIndex: 1,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  },
  center: { 
    rotateY: 0,
    x: '0%',
    opacity: 1,
    scale: 1,
    zIndex: 2,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  },
  right: { 
    rotateY: -8,
    x: '20%',
    opacity: 0.7,
    scale: 0.9,
    zIndex: 1,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  },
  expanded: {
    rotateY: 0,
    x: '0%',
    opacity: 1,
    scale: 1.02,
    zIndex: 1,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  },
  focused: {
    rotateY: 0,
    x: '0%',
    opacity: 1,
    scale: 1.5,
    zIndex: 10,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.3, ease: [0.4, 0, 0.6, 1] }
  }
};

export const folderVariants: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.4 }
  }
};

export const cardEntryVariants: Variants = {
  initial: { 
    y: 100,
    opacity: 0,
    filter: 'blur(10px)'
  },
  animate: (index: number) => ({
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      delay: 0.2 + (index * 0.15),
      ease: [0.4, 0, 0.6, 1]
    }
  })
};

export const modalVariants: Variants = {
  initial: { 
    opacity: 0,
    scale: 0.8,
    y: 20
  },
  animate: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.6, 1] }
  },
  exit: { 
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] }
  }
};

export const overlayVariants: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};