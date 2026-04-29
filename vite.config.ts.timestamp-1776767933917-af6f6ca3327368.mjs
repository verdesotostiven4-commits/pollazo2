// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import fs from "fs";
import path from "path";
var __vite_injected_original_dirname = "/home/project";
function safePublicCopy() {
  return {
    name: "safe-public-copy",
    apply: "build",
    async closeBundle() {
      const publicDir = path.resolve(__vite_injected_original_dirname, "public");
      const distDir = path.resolve(__vite_injected_original_dirname, "dist");
      if (!fs.existsSync(publicDir)) return;
      const imageExts = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".ico", ".avif"];
      function copyDir(srcDir, destDir) {
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
        const entries = fs.readdirSync(srcDir);
        for (const entry of entries) {
          const src = path.join(srcDir, entry);
          const dest = path.join(destDir, entry);
          try {
            const stat = fs.statSync(src);
            if (stat.isDirectory() && entry !== "src") {
              copyDir(src, dest);
            } else if (stat.isFile()) {
              const ext = path.extname(entry).toLowerCase();
              if (imageExts.includes(ext)) {
                fs.copyFileSync(src, dest);
              }
            }
          } catch {
          }
        }
      }
      copyDir(publicDir, distDir);
    }
  };
}
var vite_config_default = defineConfig({
  root: path.resolve(__vite_injected_original_dirname, "public"),
  plugins: [react(), safePublicCopy()],
  optimizeDeps: {
    exclude: ["lucide-react"]
  },
  build: {
    outDir: path.resolve(__vite_injected_original_dirname, "dist"),
    emptyOutDir: true,
    copyPublicDir: false
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gJ3ZpdGUnO1xuXG5mdW5jdGlvbiBzYWZlUHVibGljQ29weSgpOiBQbHVnaW4ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdzYWZlLXB1YmxpYy1jb3B5JyxcbiAgICBhcHBseTogJ2J1aWxkJyxcbiAgICBhc3luYyBjbG9zZUJ1bmRsZSgpIHtcbiAgICAgIGNvbnN0IHB1YmxpY0RpciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdwdWJsaWMnKTtcbiAgICAgIGNvbnN0IGRpc3REaXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnZGlzdCcpO1xuICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKHB1YmxpY0RpcikpIHJldHVybjtcblxuICAgICAgY29uc3QgaW1hZ2VFeHRzID0gWycucG5nJywgJy5qcGcnLCAnLmpwZWcnLCAnLndlYnAnLCAnLmdpZicsICcuc3ZnJywgJy5pY28nLCAnLmF2aWYnXTtcblxuICAgICAgZnVuY3Rpb24gY29weURpcihzcmNEaXI6IHN0cmluZywgZGVzdERpcjogc3RyaW5nKSB7XG4gICAgICAgIGlmICghZnMuZXhpc3RzU3luYyhkZXN0RGlyKSkgZnMubWtkaXJTeW5jKGRlc3REaXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICAgICAgICBjb25zdCBlbnRyaWVzID0gZnMucmVhZGRpclN5bmMoc3JjRGlyKTtcbiAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiBlbnRyaWVzKSB7XG4gICAgICAgICAgY29uc3Qgc3JjID0gcGF0aC5qb2luKHNyY0RpciwgZW50cnkpO1xuICAgICAgICAgIGNvbnN0IGRlc3QgPSBwYXRoLmpvaW4oZGVzdERpciwgZW50cnkpO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0ID0gZnMuc3RhdFN5bmMoc3JjKTtcbiAgICAgICAgICAgIGlmIChzdGF0LmlzRGlyZWN0b3J5KCkgJiYgZW50cnkgIT09ICdzcmMnKSB7XG4gICAgICAgICAgICAgIGNvcHlEaXIoc3JjLCBkZXN0KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhdC5pc0ZpbGUoKSkge1xuICAgICAgICAgICAgICBjb25zdCBleHQgPSBwYXRoLmV4dG5hbWUoZW50cnkpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgIGlmIChpbWFnZUV4dHMuaW5jbHVkZXMoZXh0KSkge1xuICAgICAgICAgICAgICAgIGZzLmNvcHlGaWxlU3luYyhzcmMsIGRlc3QpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvcHlEaXIocHVibGljRGlyLCBkaXN0RGlyKTtcbiAgICB9LFxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICByb290OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAncHVibGljJyksXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBzYWZlUHVibGljQ29weSgpXSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZXhjbHVkZTogWydsdWNpZGUtcmVhY3QnXSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdkaXN0JyksXG4gICAgZW1wdHlPdXREaXI6IHRydWUsXG4gICAgY29weVB1YmxpY0RpcjogZmFsc2UsXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sUUFBUTtBQUNmLE9BQU8sVUFBVTtBQUhqQixJQUFNLG1DQUFtQztBQU16QyxTQUFTLGlCQUF5QjtBQUNoQyxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxNQUFNLGNBQWM7QUFDbEIsWUFBTSxZQUFZLEtBQUssUUFBUSxrQ0FBVyxRQUFRO0FBQ2xELFlBQU0sVUFBVSxLQUFLLFFBQVEsa0NBQVcsTUFBTTtBQUM5QyxVQUFJLENBQUMsR0FBRyxXQUFXLFNBQVMsRUFBRztBQUUvQixZQUFNLFlBQVksQ0FBQyxRQUFRLFFBQVEsU0FBUyxTQUFTLFFBQVEsUUFBUSxRQUFRLE9BQU87QUFFcEYsZUFBUyxRQUFRLFFBQWdCLFNBQWlCO0FBQ2hELFlBQUksQ0FBQyxHQUFHLFdBQVcsT0FBTyxFQUFHLElBQUcsVUFBVSxTQUFTLEVBQUUsV0FBVyxLQUFLLENBQUM7QUFDdEUsY0FBTSxVQUFVLEdBQUcsWUFBWSxNQUFNO0FBQ3JDLG1CQUFXLFNBQVMsU0FBUztBQUMzQixnQkFBTSxNQUFNLEtBQUssS0FBSyxRQUFRLEtBQUs7QUFDbkMsZ0JBQU0sT0FBTyxLQUFLLEtBQUssU0FBUyxLQUFLO0FBQ3JDLGNBQUk7QUFDRixrQkFBTSxPQUFPLEdBQUcsU0FBUyxHQUFHO0FBQzVCLGdCQUFJLEtBQUssWUFBWSxLQUFLLFVBQVUsT0FBTztBQUN6QyxzQkFBUSxLQUFLLElBQUk7QUFBQSxZQUNuQixXQUFXLEtBQUssT0FBTyxHQUFHO0FBQ3hCLG9CQUFNLE1BQU0sS0FBSyxRQUFRLEtBQUssRUFBRSxZQUFZO0FBQzVDLGtCQUFJLFVBQVUsU0FBUyxHQUFHLEdBQUc7QUFDM0IsbUJBQUcsYUFBYSxLQUFLLElBQUk7QUFBQSxjQUMzQjtBQUFBLFlBQ0Y7QUFBQSxVQUNGLFFBQVE7QUFBQSxVQUNSO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFFQSxjQUFRLFdBQVcsT0FBTztBQUFBLElBQzVCO0FBQUEsRUFDRjtBQUNGO0FBRUEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTSxLQUFLLFFBQVEsa0NBQVcsUUFBUTtBQUFBLEVBQ3RDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsZUFBZSxDQUFDO0FBQUEsRUFDbkMsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGNBQWM7QUFBQSxFQUMxQjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUSxLQUFLLFFBQVEsa0NBQVcsTUFBTTtBQUFBLElBQ3RDLGFBQWE7QUFBQSxJQUNiLGVBQWU7QUFBQSxFQUNqQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
