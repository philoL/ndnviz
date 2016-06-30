import json
import sys
import os


"""
This file is to convert ndndump format to json format
so that d3 can easily use
}
"""
if len(sys.argv) < 2:
    print "parse_ndndump Usage: parse_ndndump directory (containing ndndump)"
    exit(1)
else:
    inputDirectory = sys.argv[1]

"""
Parse each file with .ndndump in the input directory to a nameTreeDict structure
{
    componentName:""
    links:{}
    leaf_counter:0
    entireName:""
    counter:0
    children:[
        nameTreeDict
    ]
}

"""
nameTreeDict = dict(componentName="/", counter=0, children=[], links = {}, entireName="/",self_counter=0)

for filename in os.listdir(inputDirectory):
    print filename
    if "ndndump" in filename:
        inputFile = open(os.path.join(inputDirectory, filename),"r")
        fileprefix = filename.split('.')[0]

        c=0
        for eachLine in inputFile:
            c+=1
            print c

            eachLineList = eachLine.split(" ")
            try:
                pktType = eachLineList[8]
            except:
                continue

            if pktType == "DATA:" or pktType == "INTEREST:":
                name = eachLineList[9].split("?")[0]
                components = name.split("/")

                #incursively search from the first level
                tmpChildren = nameTreeDict['children']

                for (index,eachComponent) in enumerate(components):
                    entireName = '/'.join(components[:index+1])

                    #skip the first component - empty string
                    if eachComponent:
                        if eachComponent[-1] == '\n':
                            eachComponent=eachComponent[:-1]

                        componentName = eachComponent
                        isFound = False

                        for (i,child) in enumerate(tmpChildren):
                            #print index, eachComponent, i, child['componentName'],componentName == child['componentName']

                            #found the keyName, go the next level
                            if componentName == child['componentName']:
                                isFound = True
                                child['counter'] += 1

                                #is not the leaf
                                if index != len(components)-1:
                                    #add to links and increase the number
                                    if fileprefix not in child['links'].keys():
                                        child['links'][fileprefix] = 1
                                    else:
                                        child['links'][fileprefix] += 1


                                    #go to the next children level, added if not exists
                                    if "children" in child.keys():
                                        tmpChildren = child['children']
                                    else:
                                        child['children'] = []
                                        tmpChildren = child["children"]
                                #is the leaf
                                else:
                                    child['leaf_counter'] += 1
                                    if fileprefix not in child['links'].keys():
                                        child['links'][fileprefix] = 1
                                    else:
                                        child['links'][fileprefix] += 1

                                break

                            else:
                                continue

                        #not found, add to the children
                        if isFound == False:
                            #if this is the last component
                            if index == len(components)-1:
                                newChild = dict(componentName=componentName,counter=1,links={},
                                    leaf_counter=1,entireName=entireName)
                                newChild['links'][fileprefix] = 1
                                tmpChildren.append(newChild)
                                tmpChildren = sorted(tmpChildren, key=lambda k: k['componentName'])

                            else:
                                newChild = dict(componentName=componentName,counter=1,children=[],links={},
                                    entireName=entireName,leaf_counter=0)
                                newChild['links'][fileprefix] = 1
                                tmpChildren.append(newChild)
                                tmpChildren = sorted(tmpChildren, key=lambda k: k['componentName'])
                                tmpChildren = newChild['children']

                        #print json.dumps(nameTreeDict, indent = 2)
                    #the first component
                    else:
                        nameTreeDict['counter'] += 1
                        if fileprefix not in nameTreeDict['links'].keys():
                            nameTreeDict['links'][fileprefix] = 1
                        else:
                            nameTreeDict['links'][fileprefix] += 1


            #other pkt types
            else:
                print pktType

        inputFile.close()

outputJson = json.dumps(nameTreeDict, indent = 2)

outputFileName = "ndndump.json"
outputFile = open(outputFileName,"w")

outputFile.write(outputJson)
outputFile.close()


