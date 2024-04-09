import { createRoot } from 'react-dom/client';

const app = document.getElementById('app')!;
const root = createRoot(app);

void (async () => {
  root.render(<div>Hello, inspector!</div>);
})();
