import { css } from "lit";

export default css`
.alert {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.5rem 1rem;
  margin-bottom: 2rem;
}

.alert .message * { 
  vertical-align: middle;
  line-height: 0;
}

.alert .message img {
  margin-right: 1rem;
}
`;