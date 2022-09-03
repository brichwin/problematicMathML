(()=>{

    let rootIssues = []

    const createElement = (elType, text, attributeValues, config) => {
        const el = document.createElement(elType)

        Object.keys(attributeValues).forEach((attribute) => {
          el.setAttribute(attribute, attributeValues[attribute])
        })

        if (text != null && text.length>0) {
          if (config != null && config.html===true) {
            el.innerHTML = text
          } else {
            el.appendChild(document.createTextNode(text))
          }
        }
        return el
    }

    const attach = (id, eventName, handler) => {
        const el=document.getElementById(id)
        if(el!==null) {
            el.addEventListener(eventName, handler)
            console.log(`attach: attached ${eventName} handler to ${id}`)
        } else {
            console.log(`attach: could not attach to:${id}`)
        }
    }

    const download = (filename, text) => {
        const el = document.createElement('a')
        el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
        el.setAttribute('download', filename)
        el.style.display = 'none'
        document.body.appendChild(el)
        el.click()
        window.setTimeout(()=>{document.body.removeChild(el)}, 20)
    }

    const saveData = () => {
        console.log('saveData:calling download')
        download(`problemMathML-${new Date().toISOString()}.js`, `problemMathML=${JSON.stringify(window.problemMathML)}`)
    }

    const buildIssuesList = () => {
        rootIssues = []

        // Find root issues
        // Create (or reset) root level Orphans issue
        problemMathML.issues['orphans'] = {
            parentIssueID: null,
            heading: 'Orphans',
            description: 'Non-root issues with parentIssueIDs that are not found.',
            displayOrder: 9999,
            children: []
        }
        Object.keys(problemMathML.issues).forEach(key => {
            if(Object.hasOwn(problemMathML.issues, key) && problemMathML.issues[key].parentIssue===null) {
                rootIssues.push({
                    issueID: key,
                    displayOrder: problemMathML.issues[key].displayOrder
                })
            }
            problemMathML.issues[key].children = []
        })
        rootIssues.sort((a,b)=>{
            if(a.displayOrder < b.displayOrder) return -1
            if(a.displayOrder > b.displayOrder) return 1
            if(problemMathML.issues[a.issueID].heading < problemMathML.issues[b.issueID].heading) return -1
            if(problemMathML.issues[a.issueID].heading > problemMathML.issues[b.issueID].heading) return 1
            return 0
        })

        // Add child issues
        Object.keys(problemMathML.issues).forEach(key => {
            if(Object.hasOwn(problemMathML.issues, key) && problemMathML.issues[key].parentIssue !== null) {
                if(Object.hasOwn(problemMathML.issues, problemMathML.issues[key].parentIssue)) {
                    problemMathML.issues[problemMathML.issues[key].parentIssue].children.push(key)
                } else {
                    problemMathML.issues['orphans'].children.push(key)
                }
            }
        })

        // Sort child issues
        Object.keys(problemMathML.issues).forEach(key => {
            if(Object.hasOwn(problemMathML.issues, key) && problemMathML.issues[key].children.length>1) {
                problemMathML.issues[key].children.sort((a,b)=>{
                    if(problemMathML.issues[a].displayOrder < problemMathML.issues[b].displayOrder) return -1
                    if(problemMathML.issues[a].displayOrder > problemMathML.issues[b].displayOrder) return 1
                    if(problemMathML.issues[a].heading < problemMathML.issues[b].heading) return -1
                    if(problemMathML.issues[a].heading > problemMathML.issues[b].heading) return 1
                    return 0
                })
            }
        })
    }

    const newExample = () => {

    }

    const newIssue = () => {

    }

    const newMathML = () => {

    }

    const newSource = () => {

    }

    const createNewIssue = (e) => {

    }

    const renderAddIssue = (container, key) => {
        const addIssueButtonContainer = createElement('div',null,{class:'addIssueContainer'})
        container.appendChild(addIssueButtonContainer)
        const button = createElement('button', key===null ? 'Add first issue' : `Add issue to ${problemMathML.issues[key].heading}`,
                                     {type:'button', 'data-issue-key':key | ''})
        button.addEventListener('click', createNewIssue)
        addIssueButtonContainer.appendChild(button)
    }

    const renderMathMLSrc = (container, mathML) => {
        // createElement('div', null, {})
    }

    const renderSpeechTexts = (container, speechTexts) => {
        // createElement('div', null, {})
    }

    const renderExampleMathML = (container, mathMLID) => {
        const mathExampleContainer = createElement('div', null, {class:'mathExampleContainer'})
        container.appendChild(mathExampleContainer)

        const renderContainer = createElement('div', null, {class:'renderContainer'})
        mathExampleContainer.appendChild(renderContainer)
        renderContainer.innerHTML = problemMathML.mathML[mathMLID].mathML

        const mathMLSrcContainer = createElement('div', null, {class:'mathMLSrcContainer'})
        mathExampleContainer.appendChild(mathMLSrcContainer)
        renderMathMLSrc(mathExampleContainer, problemMathML.mathML[mathMLID].mathML)

        const speechTextContainer = createElement('div', null, {class:'speechTextContainer'})
        mathExampleContainer.appendChild(speechTextContainer)
        renderSpeechTexts(speechTextContainer, problemMathML.mathML[mathMLID].speechTexts)
    }

    const renderIssueLevel = (container, key, level) => {
        const issue = problemMathML.issues[key]

        const issueContainer = createElement('div', null, {class:'issueContainer'})
        container.appendChild(issueContainer)
        const issueHeading = createElement(`h${level+2}`, issue.heading | 'Missing Heading', {class:'issueHeading'})
        issueContainer.appendChild(issueHeading)
        const issueDesc = createElement('p',null,{class:'issueDescription'})
        issueDesc.innerHTML = issue.description
        issueContainer.appendChild(issueDesc)

        if(issue.examples.length>0) {
            const examplesContainer = createElement('div', null, {class:'examplesContainer'})
            issueContainer.appendChild(examplesContainer)
            const examplesHeading = createElement(`h${level+3}`, 'Examples', {class:'examplesHeading'})
            examplesContainer.appendChild(examplesHeading)
            issue.examples.forEach(example => {
                const exampleContainer = createElement('div', null, {class:'exampleContainer'})
                examplesContainer.appendChild(exampleContainer)
                const exampleHeading = createElement(`h${level+4}`, example.title | 'Example', {class:'exampleHeading'})
                exampleContainer.appendChild(exampleHeading)
                const exampleDesc = createElement('p',null,{class:'exampleDescription'})
                exampleDesc.innerHTML = example.exampleDesc
                exampleContainer.appendChild(exampleDesc)
                renderExampleMathML(exampleContainer, example.exampleID)
                if(example.suggestionDesc.length>0) {
                    const suggestionDesc = createElement('p',null,{class:'suggestionDescription'})
                    suggestionDesc.innerHTML = example.suggestionDesc
                    exampleContainer.appendChild(suggestionDesc)
                }
                renderExampleMathML(exampleContainer, example.suggestionID)
            })
        }

        if(issue.children.length>0) {
            issue.children.forEach(key=>{renderIssueLevel(issueContainer, key, level+1)})
        }
        renderAddIssue(issueContainer, key)
    }

    const renderEditableReport = () => {
        const report = document.getElementById('report')
        report.childNodes.forEach((el)=>{report.removeChild(el)})
        buildIssuesList()
        let mainHeading = createElement('h1','Editable MathML Issues Report',{})
        report.appendChild(mainHeading)
        let lastKey = null
        rootIssues.forEach(key => {
            renderIssueLevel(report, key, 0)
            lastKey = key
        })
        renderAddIssue(report, lastKey)
    }

    const init = () => {
        attach('saveJSON', 'click', saveData)
        renderEditableReport()
        console.log('editProblemMathML.js initialized')
    }

    window.onload = () => {window.setTimeout(init, 20)}
})();

