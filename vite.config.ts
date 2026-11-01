import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          vendor: ['react', 'react-dom', 'react-router-dom'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          supabase: ['@supabase/supabase-js'],
          soc2: [
            './src/pages/Soc2AssessmentPage.tsx',
            './src/components/soc2/EmailVerification.tsx',
            './src/components/soc2/QuestionCard.tsx',
            './src/components/soc2/SectionNav.tsx',
            './src/components/soc2/ResultsPage.tsx',
            './src/hooks/useSoc2Assessment.ts',
            './src/lib/soc2-questions.ts',
            './src/lib/soc2-api.ts',
          ],
          calculator: ['./src/pages/CalculatorPage.tsx'],
          homeCalculator: ['./src/components/HomeCalculator.tsx'],
          scorecard: ['./src/pages/ScorecardPage.tsx'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});