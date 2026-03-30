import { css } from "lit";

export default css`
.skeleton {
  animation: skeleton-loading 1s linear infinite alternate;
  display: block;
}

@keyframes skeleton-loading {
  0% {
    background-color: hsl(200, 20%, 80%);
  }
  100% {
    background-color: hsl(200, 20%, 95%);
  }
}

.skeleton-text {
  width: 100%;
  height: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 0.25rem;
}

.skeleton-circle {
  border-radius: 50%;
}
`;