# Releases

Este projeto usa `electron-builder` para gerar instaladores Windows e publicar releases no GitHub.

## Gerar instalador local

```bash
npm run dist
```

Os ficheiros ficam na pasta `release/`:

- `ToDo Calendar Setup <versao>.exe`
- `ToDo Calendar-<versao>-win.zip`

No Windows local, a build com icone embutido no executavel pode precisar do **Developer Mode** ativo ou de permissoes para criar symbolic links. Se falhar ao extrair `winCodeSign`, publica pela GitHub Action ou ativa o Developer Mode em **Settings > System > For developers**.

## Publicar uma versao alfa no GitHub

1. Garante que a working tree esta limpa:

   ```bash
   git status
   ```

2. Faz push dos commits:

   ```bash
   git push origin main
   ```

3. Cria uma tag com a mesma versao do `package.json`:

   ```bash
   git tag v0.1.0-alpha.3
   ```

4. Faz push da tag:

   ```bash
   git push origin v0.1.0-alpha.3
   ```

5. No GitHub, abre o separador **Actions** e espera o workflow **Release** terminar.

6. Abre o separador **Releases**. A release deve aparecer com o instalador anexado.

7. Marca a release como **Pre-release** se o GitHub nao o fizer automaticamente.

## Proxima alfa

Para a proxima versao, altera a versao antes da tag:

```bash
npm version 0.1.0-alpha.4 --no-git-tag-version
git add package.json package-lock.json
git commit -m "Bump version to 0.1.0-alpha.4"
git tag v0.1.0-alpha.4
git push origin main
git push origin v0.1.0-alpha.4
```
