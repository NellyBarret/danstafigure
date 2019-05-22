filename="questions.txt"
filename2="../questions.json"
# echo "" > $filename2 # empty the file
# echo "{" >> $filename2
# while read p; do
#     if [[ $p == \#* ]]; then
#         figName=`echo $p | cut -d'#' -f2`
#         echo "\"$figName\": [" >> $filename2
#     else
#         if [[ $p != "" ]]; then
#             echo "\"$p\"," >> $filename2
#         else
#             echo "]," >> $filename2
#         fi
#     fi
# done < $filename
# echo "}" >> $filename2


while read p2; do
    awk '{echo "%s\\n"}' $filename2
    # echo $p2
    if [[ $p2 == *\,$'\r'\" ]]; then
        echo "okay"
    #     # echo "$p2//",\n]"/"\n]"}" >> $filename2
    # else
    #     echo "ko"
    fi

    # if [[ $p2 =~ *\],\n\} ]]; then
    #     echo "okay2"
    #     # echo "$p2//"\],\n\}"/"\n]"}" >> $filename2
    # else
    #     echo "ko2"
    # fi
done < $filename2
echo "Finished"


# declare -i i
# i=0
# filename="questions.txt"
# while read p; do
#     if [[ $p == \#* ]]; then
#         i=0
#         dirName=`echo $p | cut -d'#' -f2`
#         if [ ! -d "$dirName" ]; then
#             mkdir $dirName
#         else
#             # delete the old folder and create an empty new
#             rm -rf $dirName
#             mkdir $dirName 
#         fi
#     else
#         if [[ $p != "" ]]; then
#             echo $p >> "${dirName}/question${i}.txt"
#             i=$((i + 1))
#         fi
#     fi
# done < $filename
# echo "Finished"