declare -i i
i=0
filename="definitions.txt"
while read p; do
    if [[ $p == \#* ]]; then
        i=0
        dirName=`echo $p | cut -d'#' -f2`
        if [ ! -d "$dirName" ]; then
            mkdir $dirName
        else
            # delete the old folder and create an empty new
            rm -rf $dirName
            mkdir $dirName 
        fi
    else
        if [[ $p != "" ]]; then
            echo $p >> "${dirName}/question${i}.txt"
            i=$((i + 1))
        fi
    fi
done < $filename
echo "Finished"