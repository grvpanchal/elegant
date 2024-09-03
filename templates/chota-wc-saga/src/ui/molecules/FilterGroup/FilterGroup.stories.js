import FilterGroup from "./FilterGroup.component";
export default { title: "Molecules/FilterGroup", render: FilterGroup };

export const Default = {
  args: {
    filterItems: [
      {
        id: '1',
        label: 'abc',
        selected: false,
      },
      {
        id: '2',
        label: 'xyz',
        selected: false,
      },
      {
        id: '3',
        label: 'pqr',
        selected: true,
      },
    ],
    onClick: (e) => { e.preventDefault(); console.log('asdasd') },
  },
};
