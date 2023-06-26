# SAGE (Sistema de Automação e Gerenciamento Editorial)

O Projeto SAGE cria novos blog posts com base nos posts dos concorrentes e os posta automaticamente em um outro blog.  

# Tecnologias & conceitos utilizados

 - SOLID,
 - Tokenização,
 - Design Patterns,
 - Casos de uso,
 - Controle de acesso (RBAC),
 - Scrapping,
 - Inteligência Artificial,
 - HTML, CSS e JS,
 - Node.js,
 - Typescript (tsx, tsup);
 - Fastify;
 - Prisma ORM;
 - Docker;

# Core do Projeto (Ciclo de edição)

O Core do projeto é composto por 4 módulos:

[Scrapping] => [Reescrita] => [Anti-plágio] => [Postagem]



# Requisitos funcionais (Deve ser possível)

- [ ] Cadastrar, Editar, Apagar um usuários;
- [ ] Logar no sistema;
- [ ] Deslogar no sistema;
- [ ] Cadastrar, Editar, Apagar todas as infos necessárias para o scrapping;
- [ ] Cadastrar todas as infos necessárias do WP;
- [ ] Cadastrar, Editar, Apagar um concorrente;
- [ ] Cadastrar, Editar, Apagar um blog;
- [ ] Ver o log de atividade geral, por blog, por concorrente;
- [ ] Ver atividade em andamento;
- [ ] Ver atividades agendadas;
- [ ] Cancelar, Editar postagem antes de ser enviada para o WP;
- [ ] Ver itens que deram erro, identificar o problema e refazer;
- [ ] Métricas: Posts, Anti plágio, Reescrita, Scrapping (D+1/7/30/Total);
- [ ] Enviar notificações quando algo der errado;



# Regras de negócio

- [ ] Somente o ADMIN pode criar usuários;
- [ ] Somente o ADMIN pode apagar usuários, blogs, vars do scrapping;
- [ ] Toda ação deve ser vinculada a um usuário;



# Requisitos não-funcionais

- [ ] A senha do usuário precisa estar criptografada;
- [ ] 2FA Auth;
- [ ] O usuário deve ser identificado por um JWT (JSON Web Token);
- [ ] Backups;