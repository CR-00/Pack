const paginationAriaLabel = (page) => {
  switch (page) {
    case "dots":
      return "dots element aria-label";
    case "prev":
      return "previous page button aria-label";
    case "next":
      return "next page button aria-label";
    case "first":
      return "first page button aria-label";
    case "last":
      return "last page button aria-label";
    default:
      return `${page} item aria-label`;
  }
};

export default paginationAriaLabel;