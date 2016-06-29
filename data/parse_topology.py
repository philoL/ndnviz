import json
import sys

"""
This file is to convert topology file from mini-ndn to json format
so that d3 can easily use
"""
if len(sys.argv) < 2:
    print "topology_parse Usage: topology_parse file.conf"
    exit(1)
else:
    inputFile = open(sys.argv[1],"r")

outputDict = {}
counter = 0
for eachLine in inputFile:
    counter += 1
    #parse nodes first
    if "nodes" in eachLine:
        currentVariable = "nodes"
        outputDict[currentVariable] = []
    elif "links" in eachLine:
        #build an index list for nodes first 
        #for links to index node names easily
        nodes = outputDict["nodes"]
        nodesIndex = {}
        for i,d in enumerate(nodes):
            nodesIndex[d['name']] = i 

        currentVariable = "links"
        outputDict[currentVariable] = []
    else:
        #parse line with node parameters (Except "app")
        if currentVariable == "nodes":

            splitList = eachLine.split(" ")
            name = splitList[0][:-1]
            outputDict[currentVariable].append(dict(name=name,group=counter))

        #parse links
        elif currentVariable == "links":

            splitList = eachLine.split(" ")
            nameList = splitList[0].split(":")
            sourceName = nameList[0]
            targetName = nameList[1]


            #add source and target to linkDict
            linkDict = dict(source=nodesIndex[sourceName], target=nodesIndex[targetName])

            #add name to linkDict
            linkDict["name"] = sourceName+'-'+targetName

            #add other parameters to linkDict
            for eachParameter in splitList[1:]:
                eachParameterList = eachParameter.split("=")
                keyName = eachParameterList[0]
                value = eachParameterList[1]
                if "\n" in value:
                    value = value[:-1]

                if keyName == "delay":
                    value = int(value[:-2])
                linkDict[keyName] = value


            outputDict[currentVariable].append(linkDict)

outputDict["links"] = sorted(outputDict["links"], key=lambda k:k['target'])
outputJson = json.dumps(outputDict, indent = 2, )

outputFileName = sys.argv[1][:-4]+'json'
outputFile = open(outputFileName,"w")

outputFile.write(outputJson)

inputFile.close()
outputFile.close()


