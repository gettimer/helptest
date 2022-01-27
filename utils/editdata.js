export function convertPageDataToSlug(pageData) {
    return (
        "/" +
        pageData.Tool +
        "/" +
        pageData.Category +
        "/" +
        pageData.Title.split(" ")
            .join("-")
            .toLowerCase()
            .replace(/[^-\w\s]/gi, "")
    );
}

export function createHelp(ele) {
    return {
        url: convertPageDataToSlug(ele),
        category: ele.Category,
        featured: ele.Featured,
        title: ele.Title,
        id: ele.id
    };
}

export function groupByCategory(toolHelps) {
    const groupToolHelpsByCategory = toolHelps.reduce((ele, node) => {
        ele[node.category] = [...(ele[node.category] || []), node];
        return ele;
    }, {});

    return Object.keys(groupToolHelpsByCategory)
        .sort()
        .reduce((accumulator, currentValue) => {
            accumulator[currentValue] = groupToolHelpsByCategory[currentValue];
            return accumulator;
        }, {});
}