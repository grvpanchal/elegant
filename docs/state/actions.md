## Actions

- Atomic Events are linked with Actions in container
- A reducer has a single entity in CRUD action
- An Operation has three entities in CRUD action i.e. loading / loader / initial, success and error
   - loading / loader / initial work with trigger on page / organism load and can be linked with Skeleton
   - Success Entity is linked with Organism Data props
   - Error Entity is linked Alerts of page or organism
- Hydrate Action for SSR. Investigate??