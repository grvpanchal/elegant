
import SiteHeaderContainer from "../containers/SiteHeaderContainer";
import Layout from "../ui/templates/Layout/Layout.component";
import TodoFiltersContainer from "../containers/TodoFiltersContainer";
import TodoListContainer from "../containers/TodoListContainer";

export default function HomePage() {
  return (
    <Layout>
      <SiteHeaderContainer />
      <TodoListContainer />
      <TodoFiltersContainer />
    </Layout>
  );
}
