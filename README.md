<div align="center">
  <img src="https://github.com/VitorRuan/Sprints/blob/main/Imagens/capilogo.png" alt="banner">
</div>
<br id="topo">
<p align="center">
<a href="#sobre">Sobre</a>  |  
<a href="#backlogs">Backlogs & User Stories</a>  |  
<a href="#prototipo">Protótipo & Documentação</a>  |  
<a href="#arquitetura">Arquitetura</a>  |  
<a href="#tecnologias">Tecnologias</a>  |  
<a href="#equipe">Equipe</a>
</p>
<span id="sobre">
 
## :bookmark_tabs: Sobre o projeto
A ideia para o desenvolvimento do projeto surgiu da necessidade de se adequar ao tema proposto pela coordenadora do curso de Desenvolvimento de Software Multiplataforma, professora Angelina Vitorino de Souza Melaré. Ela identificou uma dificuldade na secretaria acadêmica da unidade, o que nos levou a buscar a criação de um sistema/site que facilitasse o cadastro dos professores e das disciplinas que eles lecionam. 
A partir disso buscamos escalar o projeto para uma aplicação mobile buscando cumprir as demandas que nos foram propostas, para que esse trabalho feito pela secretária acadêmica da unidade possa ser realizado com uma praticidade maior.
 
> _Projeto baseado na metodologia ágil SCRUM, procurando desenvolver a Proatividade, Autonomia, Colaboração e Entrega de Resultados dos estudantes envolvidos_
 
:pushpin: Status do Projeto: **Em execução**
 
### 🏁 Entregas de Sprints
Cada sprint no desenvolvimento ágil resulta em uma entrega funcional e incremental do sistema. Essas entregas são versões do produto que incluem novas funcionalidades implementadas e testadas, prontas para serem demonstradas e, potencialmente, utilizadas.

<details>
   <summary>Linha do Tempo Sprints</summary>
    <div align="center">
        <img src="https://github.com/VitorRuan/Sprints/blob/main/Imagens/Jira%20-%20Linha%20do%20tempo.png">
    </div>
</details>
 
<span id="backlogs">
 
## :dart: Backlogs & User Stories

### ✅ Requisitos Funcionais

| ID   | Módulo               | Requisito Funcional                                                           | Prioridade | Status         |
|------|----------------------|-------------------------------------------------------------------------------|------------|----------------|
| RF01 | Registros            | Permitir que o usuário salve um novo registro no sistema.                    | 🔴 Alta     | ✅ Concluído    |
| RF02 | Registros            | Permitir a leitura e visualização de registros cadastrados.                  | 🔴 Alta     | ✅ Concluído    |
| RF03 | Registros            | Permitir a edição de registros existentes.                                   | 🟡 Média    | ✅ Concluído    |
| RF04 | Registros            | Permitir a exclusão de registros do sistema.                                 | 🔴 Alta     | ✅ Concluído    |
| RF05 | Disciplinas e Cursos | Permitir o cadastro de novas disciplinas.                                    | 🔴 Alta     | ✅ Concluído    |
| RF06 | Disciplinas e Cursos | Permitir a atribuição de disciplinas a professores.                          | 🔴 Alta     | ✅ Concluído    |
| RF07 | Disciplinas e Cursos | Permitir o cadastro de cursos com nome, código e sigla.                      | 🟡 Média    | ✅ Concluído    |
| RF08 | Disciplinas e Cursos | Permitir a atribuição de disciplinas a cursos.                               | 🟡 Média    | ✅ Concluído    |
| RF09 | Relatórios           | Permitir a exportação de um registro específico em PDF.                      | 🟡 Média    | ✅ Concluído    |
| RF10 | Relatórios           | Permitir a geração de um relatório geral de todos os objetos.                | 🟡 Média    | ✅ Concluído    |
| RF11 | Relatórios           | Permitir que o usuário gere relatórios conforme filtros personalizados.      | 🔴 Alta     | ✅ Concluído    |


## 📋 Requisitos Não Funcionais

| ID     | Requisito Não Funcional    | Categoria         | Descrição                                                                 |
|--------|----------------------------|-------------------|---------------------------------------------------------------------------|
| RnF01  | Tempo de resposta          | Desempenho        | A aplicação foi pensada para que o usuário não aguarde muito tempo de resposta. |
| RnF02  | Interface intuitiva        | Usabilidade       | A interface foi pensada para ser simples, com navegação fácil e consistente.     |
| RnF03  | Autenticação segura        | Segurança         | O login é protegido através de um token JWT.                              |
| RnF04  | Proteção de dados          | Segurança         | Todos os dados sensíveis estão protegidos por tokens.                     |
| RnF05  | Plataformas suportadas     | Compatibilidade   | Durante o desenvolvimento, realizamos testes nos dois principais sistemas operacionais mobile. |
| RnF06  | Disponibilidade            | Confiabilidade    | A aplicação deve estar disponível 99,5% do tempo.                         |
| RnF07  | Modularidade               | Manutenibilidade  | O código deve ser modular e seguir boas práticas de arquitetura.          |


<div align="center">  
  <img src="https://github.com/VitorRuan/Sprints/blob/main/Imagens/User%20Stories.png" alt="User Stories">
</div>


 
<span id="prototipo">
 
## :desktop_computer: Protótipo & Documentação
Durante o desenvolvimento do sistema de cadastro de professores e cursos, a fase inicial de planejamento e prototipagem desempenhou um papel crucial ao assegurar que todos os requisitos funcionais e não funcionais fossem claramente definidos e visualizados antes da implementação.
 
Essa API RESTful utiliza os métodos HTTP POST, GET, PUT e DELETE, completando os métodos básicos do CRUD. Além disso, a aplicação é construída sobre a arquitetura MVC.
> 🔗 **Links gerais** <br>
> - Relatório de Analise de Segurança: [clique aqui para acessar](https://github.com/lucas-adami/atividade-avaliativa-27-11/blob/master/analise_seguranca_sistema_completo.pdf)
> - 
> - Links para os repositórios criados:
>    - **Protótipo de alta fidelidade:** https://www.figma.com/design/doeCpjTHXJP6kbePOpOJs9/Cadastro-de-Professores?node-id=0-1&t=8qEmhLqBiF7zHTU5-0
>    - **Frontend:** [acessar Frontend](https://github.com/proj-cadastro/projeto-cadastro-app)
>    - **Backend:** [acessar Backend](https://github.com/proj-cadastro/projeto-cadastro-app-api)
>    - **API Machine Learning:** .[acessar API ML](https://github.com/proj-cadastro/projeto-cadastro-ml-api)
>  

>    
 
→ [Voltar ao topo](#topo)

### :clapper: Funcionalidades do Sistema
Confira a seguir uma demonstração das funcionalidades do sistema:
<details>
   <summary>Login</summary>
    <div align="center">
        <img src="https://github.com/lucas-adami/sistema-de-cadastro/blob/main/Gifs%20PI/Login.gif">
    </div>
</details>
<details>
   <summary>Cadastro de Professores</summary>
    <div align="center">
        <img src="https://github.com/lucas-adami/sistema-de-cadastro/blob/main/Gifs%20PI/Cadastro%20de%20Professores.gif">
    </div>
</details>
<details>
   <summary>Editar Professores</summary>
    <div align="center">
        <img src="https://github.com/lucas-adami/sistema-de-cadastro/blob/main/Gifs%20PI/Editar%20Professores.gif">
    </div>
</details>
<details>
   <summary>Cadastro de Cursos</summary>
    <div align="center">
        <img src="https://github.com/lucas-adami/sistema-de-cadastro/blob/main/Gifs%20PI/Cadastro%20de%20Curso.gif">
    </div>
</details>
<details>
   <summary>Editar Cursos</summary>
    <div align="center">
        <img src="https://github.com/lucas-adami/sistema-de-cadastro/blob/main/Gifs%20PI/Editar%20Curso.gif">
    </div>
</details>
 
<span id="arquitetura">
 
## 🏗️ Arquitetura do projeto
![Arquitetura Projeto](https://github.com/lucas-adami/sistema-de-cadastro/blob/main/Gifs%20PI/ARC%20PI.png)
 
<span id="tecnologias">
 
## 🛠️ Tecnologias
 
As seguintes ferramentas, linguagens, bibliotecas e tecnologias foram usadas na construção do projeto:
 
<img src="https://img.shields.io/badge/Figma-CED4DA?style=for-the-badge&logo=figma&logoColor=DC143C" alt="Figma" /> 
<img src="https://img.shields.io/badge/TypeScript-CED4DA?style=for-the-badge&logo=typescript&logoColor=007ACC" alt="Typescript" />
<img src="https://img.shields.io/badge/HTML5-CED4DA?style=for-the-badge&logo=html5&logoColor=E34F26" alt="HTML" /> 
<img src="https://img.shields.io/badge/CSS3-CED4DA?style=for-the-badge&logo=css3&logoColor=1572B6" alt="CSS" /> 	
<img src="https://img.shields.io/badge/Node.js-CED4DA?style=for-the-badge&logo=nodedotjs&logoColor=339933" alt="Node" />  
<img src="https://img.shields.io/badge/MongoDB-CED4DA?style=for-the-badge&logo=mongodb&logoColor=4EA94B" alt="MongoDB" /><br>
<img src="https://img.shields.io/badge/VS_Code-CED4DA?style=for-the-badge&logo=visual%20studio%20code&logoColor=0078D4" alt="VS Code" /> 
<img src="https://img.shields.io/badge/Discord-CED4DA?style=for-the-badge&logo=discord&logoColor=7289DA" alt="Discord" /> 
<img src="https://img.shields.io/badge/GitHub-CED4DA?style=for-the-badge&logo=github&logoColor=20232A" alt="GitHub" />
<img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />  

→ [Voltar ao topo](#topo)
 
<span id="equipe">
 
## :busts_in_silhouette: Equipe
 
|    Função     | Nome                                  |                                                                                                                                                      LinkedIn & GitHub                                                                                                                                                      |
| :-----------: | :------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| Product Owner | Erick Oliveira Nascimento          |     [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/erick-nascimento-b560b5126) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/erick-sts)              |
| Scrum Master  | Juliano Aparecido Ramalho |      [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/julianoramalho/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/juramal)    |
|   Dev Team    | Leon Pereira Pinto Fagundes               |         [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/leonfagundes) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/leonfagundes27)        |
|   Dev Team    | Lucas Adami Gomes                   |         [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/adami-lucas/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/lucas-adami)        |
|   Dev Team    |Matheus Garibaldi Rodrigues                |   [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/matheus-garibaldi/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/garibaldii)   |
|   Dev Team    | Vitor Ruan Firmino de Oliveira       |           [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/vitor-ruan777) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/VitorRuan)          |
 
 
→ [Voltar ao topo](#topo)
