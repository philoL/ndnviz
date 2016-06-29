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
Parse each file with .ndndump in the input directory
into nameTreeDict
"""
nameTreeDict = dict(name="/", counter=0, children=[], links = {}, entireName="/",self_counter=0)

for filename in os.listdir(inputDirectory):
    if "ndndump" in filename:
        inputFile = open(os.path.join(inputDirectory, filename),"r")
        fileprefix = filename.split('.')[0]

        for eachLine in inputFile:
            eachLineList = eachLine.split(" ")
            try:
                pktType = eachLineList[8]
            except:
                continue
            if pktType == "DATA:" or pktType == "INTEREST:":
                name = eachLineList[9].split("?")[0]
                #skip last component for name tree only
                components = name.split("/")
                tmpChildren = nameTreeDict['children']

                #print components
                for (index,eachComponent) in enumerate(components):
                    entireName = '/'.join(components[:index+1])
                    #print index,eachComponent
                    #skip the first component - empty string
                    if eachComponent:
                        componentName = eachComponent
                        isFound = False
                        for (i,child) in enumerate(tmpChildren):
                            #found the keyName, go the next level
                            if componentName == child['name']:
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
                                    child['self_counter'] += 1
                                    if fileprefix not in child['links'].keys():
                                        child['links'][fileprefix] = 1
                                    else:
                                        child['links'][fileprefix] += 1

                                break
                        #not found, add to the children
                        if isFound == False:
                            #if this is the last component
                            if index == len(components)-1:
                                newChild = dict(name=componentName,counter=1,links={},
                                    self_counter=1,entireName=entireName)
                                newChild['links'][fileprefix] = 1
                                tmpChildren.append(newChild)
                                tmpChildren = sorted(tmpChildren, key=lambda k: k['name'])

                            else:
                                newChild = dict(name=componentName,counter=1,children=[],links={},
                                    entireName=entireName)
                                newChild['links'][fileprefix] = 1
                                tmpChildren.append(newChild)
                                tmpChildren = sorted(tmpChildren, key=lambda k: k['name'])
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


