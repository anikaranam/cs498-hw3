import findspark
findspark.init()
import pyspark
import sys
import json
inputUrl = sys.argv[1]
outputUrl = sys.argv[2]
weights = json.loads(sys.argv[3])
def mapFunc(x):
        value = 0
        for i in x:
                if i in weights:
                        value += weights[i]
        return (x, value)
def reduceFunc(v1, v2):
        return v1 + v2
sc = pyspark.SparkContext()
print('init')
lines = sc.textFile(inputUrl)
print(lines.count())
sentenceCounts = lines.map(mapFunc).reduceByKey(reduceFunc)
sentenceCounts.saveAsTextFile(outputUrl)
print('done')