# Dockerfile otimizado para Next.js no Railway
FROM node:20-alpine AS base

# Instalar dependências necessárias
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json* ./
RUN npm ci

# Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desabilitar telemetria durante o build
ENV NEXT_TELEMETRY_DISABLED=1

# Build da aplicação
RUN npm run build

# Runner stage - Imagem final de produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários do builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Mudar ownership dos arquivos
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expor porta (Railway usa a variável PORT)
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Comando para iniciar a aplicação
CMD ["node", "server.js"]
